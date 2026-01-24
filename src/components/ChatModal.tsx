/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Paperclip,
  Check,
  CheckCheck,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { db, getFilePreview } from "@/utils/pockatbase";
import { collectionNames } from "@/constant";

type Message = {
  id?: string;
  order: string;
  sender: "client" | "admin" | "owner" | string;
  message?: string;
  created: string;
  read?: boolean;
  media?: string[];
};

type Props = {
  orderId: string;
  open: boolean;
  onClose: () => void;
};

type PreviewFile = {
  file: File;
  url: string;
  type: "image" | "other";
};

export default function ChatModal({ orderId, open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const markTimer = useRef<number | null>(null);

  /* ---------------- data ---------------- */
  useEffect(() => {
    if (!open) return;
    let mounted = true;

    async function load() {
      const res = await db
        .collection<Message>(collectionNames.MESSAGES)
        .getFullList(200, {
          sort: "-created",
          filter: `order = "${orderId}"`,
        });
      if (!mounted) return;
      setMessages(res.reverse());
      setTimeout(scrollToBottom, 50);
      queueMarkAllRead(res);
    }

    load();

    db.collection(collectionNames.MESSAGES).subscribe(
      "*",
      (e: any) => {
        if (!mounted) return;
        if (e.action === "create") {
          setMessages((p) => [...p, e.record]);
          setTimeout(scrollToBottom, 50);
          const sender = db.authStore.isValid ? "admin" : "client";
          if (e.record?.sender !== sender && !e.record?.read) {
            queueMarkAllRead([e.record]);
          }
        } else if (e.action === "update") {
          setMessages((p) =>
            p.map((m) => (m.id === e.record.id ? e.record : m)),
          );
        }
      },
      { filter: `order = "${orderId}"` },
    );

    return () => {
      mounted = false;
      db.collection(collectionNames.MESSAGES).unsubscribe("*");
    };
  }, [orderId, open]);

  const sender = useMemo(() => (db.authStore.isValid ? "admin" : "client"), []);
  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read && m.sender !== sender).length,
    [messages, sender],
  );

  function queueMarkAllRead(list: Message[]) {
    if (markTimer.current) window.clearTimeout(markTimer.current);
    markTimer.current = window.setTimeout(async () => {
      const toMark = list.filter((m) => m.sender !== sender && !m.read && m.id);
      console.log(toMark);
      if (!toMark.length) return;
      await Promise.all(
        toMark
          .slice(0, 20)
          .map((m) =>
            db
              .collection(collectionNames.MESSAGES)
              .update(m.id as string, { read: true }),
          ),
      );
    }, 200);
  }

  function scrollToBottom() {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  /* ---------------- files ---------------- */
  function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    const mapped: PreviewFile[] = picked.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "other",
    }));
    setFiles((p) => [...p, ...mapped]);
  }

  function removeFile(idx: number) {
    setFiles((p) => {
      URL.revokeObjectURL(p[idx].url);
      return p.filter((_, i) => i !== idx);
    });
  }

  /* ---------------- send ---------------- */
  async function send() {
    if (sending) return;
    if (!text.trim() && files.length === 0) return;
    setSending(true);

    try {
      const fd = new FormData();
      fd.append("order", orderId);
      fd.append("sender", db.authStore.isValid ? "admin" : "client");
      fd.append("read", "false");
      if (text.trim()) fd.append("message", text.trim());
      files.forEach((f) => fd.append("media", f.file));

      await db.collection(collectionNames.MESSAGES).create(fd);
      setText("");
      setFiles([]);
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full h-full md:w-[480px] md:h-[80vh] bg-background flex flex-col rounded-none md:rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Support</div>
              <div className="text-xs text-muted-foreground font-mono">
                {orderId}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-muted/30 to-background"
        >
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const mine =
                sender === "admin"
                  ? m.sender === "admin"
                  : m.sender === "client";
              return (
                <div
                  key={m.id}
                  className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm text-sm ${
                    mine
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto bg-muted"
                  }`}
                >
                  {m.message && (
                    <div className="whitespace-pre-wrap">{m.message}</div>
                  )}

                  {m.media?.length ? (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {m.media.map((file) => {
                        const url = getFilePreview({
                          fileName: file,
                          collectionName: collectionNames.MESSAGES,
                          recordId: m.id!,
                        });
                        return (
                          <img
                            key={file}
                            src={url}
                            className="rounded-lg object-cover h-32 w-full"
                          />
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="mt-1 flex items-center justify-end gap-1 text-[11px] opacity-70">
                    {new Date(m.created).toLocaleTimeString()}
                    {mine &&
                      (m.read ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t bg-card px-4 py-3">
          {files.length > 0 && (
            <div className="mb-3 flex gap-2 overflow-x-auto">
              {files.map((f, i) => (
                <div key={i} className="relative">
                  {f.type === "image" ? (
                    <img
                      src={f.url}
                      className="h-20 w-20 rounded-xl object-cover border"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-xl flex items-center justify-center bg-muted">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-0 -right-2 h-5 w-5 rounded-full"
                    onClick={() => removeFile(i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <label className="p-2 rounded-md hover:bg-muted cursor-pointer">
              <input
                type="file"
                multiple
                hidden
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={onFilePick}
              />
              <Paperclip className="h-5 w-5" />
            </label>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message"
              className="flex-1 resize-none min-h-[40px] max-h-32"
            />

            <Button onClick={send} disabled={sending}>
              {sending ? "…" : "Send"}
            </Button>
          </div>

          {unreadCount > 0 && (
            <div className="mt-1 text-[10px] text-muted-foreground">
              {unreadCount} unread
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
