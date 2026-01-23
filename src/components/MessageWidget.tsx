/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { db } from "@/utils/pockatbase";
import { collectionNames } from "@/constant";

type Message = {
  id?: string;
  order: string;
  sender: "client" | "admin" | "owner" | string;
  message: string;
  created: string;
  read?: boolean;
};

export default function MessageWidget({ orderId }: { orderId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await db
          .collection<Message>(collectionNames.MESSAGES)
          .getFullList(50, {
            sort: "-created",
            filter: `order = "${orderId}"`,
          });
        if (!mounted) return;
        setMessages(res.reverse());
        setTimeout(() => scrollToBottom(), 50);
      } catch (err) {
        console.error("load messages", err);
      }
    }
    load();

    db.collection(collectionNames.MESSAGES).subscribe(
      `order="${orderId}"`,
      (e: any) => {
        console.log("eeeeeeeeeeee");
        if (!mounted) return;
        // handle create/update/delete
        if (e.action === "create") {
          setMessages((p) => [...p, e.record]);
          setTimeout(() => scrollToBottom(), 50);
        } else if (e.action === "update") {
          setMessages((p) =>
            p.map((m) => (m.id === e.record.id ? e.record : m)),
          );
        } else if (e.action === "delete") {
          setMessages((p) => p.filter((m) => m.id !== e.record.id));
        }
      },
    );

    return () => {
      mounted = false;
      try {
        db.collection(collectionNames.MESSAGES).unsubscribe();
      } catch (e) {
        console.log(e);
        // ignore
      }
    };
  }, [orderId]);

  function scrollToBottom() {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  async function send() {
    if (!text.trim()) return;
    try {
      await db.collection(collectionNames.MESSAGES).create({
        order: orderId,
        sender: "client",
        message: text.trim(),
      });
      setText("");
      // notify admin: create a notification record or rely on realtime (admins subscribe)
      // we'll leave notification to admin-side subscription
    } catch (err) {
      console.error("send message", err);
    }
  }

  return (
    <div className="mt-6">
      <div className="border rounded-md bg-white dark:bg-gray-800 p-3">
        <div className="h-48 overflow-auto space-y-2" ref={listRef}>
          {messages.length === 0 ? (
            <div className="text-xs text-slate-400">
              No messages yet. Ask the owner a question.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded-md ${m.sender === "client" ? "bg-emerald-50 text-emerald-800 self-end" : "bg-gray-100 dark:bg-gray-700 text-slate-800"}`}
              >
                <div className="text-xs text-slate-500">{m.sender}</div>
                <div className="mt-1 text-sm">{m.message}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(m.created).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-md border bg-transparent"
          />
          <button
            onClick={send}
            className="px-3 py-2 bg-emerald-600 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
