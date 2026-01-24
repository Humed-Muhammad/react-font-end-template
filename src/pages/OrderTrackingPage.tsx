/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState, type JSX } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  Loader2,
  CheckCheck,
  Construction,
  Hammer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/types";
import { Skeleton } from "@/components/shared/Skeleton";
import { useGetOrderQuery } from "@/pages/AdminPages/Orders/services";
import { db } from "@/utils/pockatbase";
import { collectionNames } from "@/constant";
import CancelledOrderView from "@/components/CancelledOrderView";
import ChatButton from "@/components/ChatButton";
import ChatModal from "@/components/ChatModal";

const STATUS_ORDER: Order["status"][] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivering",
  "delivered",
  "cancelled",
];

// exclude cancelled from the visible timeline
const VISIBLE_STATUS_ORDER = STATUS_ORDER.filter((s) => s !== "cancelled");

// statuses that should never show 'active' (in-progress) and instead be treated as completed/green
const SPECIAL_NO_ACTIVE: Order["status"][] = [
  "confirmed",
  "ready",
  "delivered",
];
const SPECIAL_NO_ACTIVE_SET = new Set(SPECIAL_NO_ACTIVE as Order["status"][]);

const STATUS_META: Record<
  Order["status"],
  { label: string; icon: React.ReactNode; color: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock className="w-5 h-5" />,
    color: "bg-yellow-400",
  },
  confirmed: {
    label: "Confirmed",
    icon: <CheckCheck className="w-5 h-5" />,
    color: "bg-green-500",
  },
  preparing: {
    label: "Preparing",
    icon: <Hammer className="w-5 h-5" />,
    color: "bg-blue-500",
  },
  ready: {
    label: "Ready",
    icon: <Package className="w-5 h-5" />,
    color: "bg-purple-500",
  },
  delivering: {
    label: "Out for delivery",
    icon: <Truck className="w-5 h-5" />,
    color: "bg-teal-500",
  },
  delivered: {
    label: "Delivered",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle className="w-5 h-5" />,
    color: "bg-red-500",
  },
};

export default function OrderTrackingPage(): JSX.Element {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    data: order,
    isLoading,
    isFetching,
    isError,
    refetch: refetchOrder,
  } = useGetOrderQuery({ orderId: orderId || "" }, { skip: !orderId });

  const [simulatedStatus, setSimulatedStatus] = useState<Order["status"]>(
    ((order?.status || "pending") as Order["status"]) || "pending",
  );

  useEffect(() => {
    if (order?.status) setSimulatedStatus(order.status as Order["status"]);
  }, [order?.status]);

  const isCancelled = simulatedStatus === "cancelled";
  const [chatOpen, setChatOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // lightweight unread indicator using messages subscription
  useEffect(() => {
    if (!orderId) return;
    let mounted = true;
    db.collection(collectionNames.MESSAGES).subscribe(
      `order="${orderId}"`,
      () => {
        if (!mounted) return;
        // naive unread: count messages not from client and not read
        // fetch minimal list to compute; avoid heavy loads
        db.collection(collectionNames.MESSAGES)
          .getFullList(50, {
            sort: "-created",
            filter: `order = "${orderId}"`,
          })
          .then((list: any[]) => {
            const count = list.filter(
              (m) => !m.read && m.sender !== "client",
            ).length;
            setUnread(count);
          })
          .catch(() => {});
      },
    );
    return () => {
      mounted = false;
      try {
        db.collection(collectionNames.MESSAGES).unsubscribe();
      } catch (err) {
        console.debug("unsubscribe error", err);
      }
    };
  }, [orderId]);

  const currentIndex = useMemo(
    () => VISIBLE_STATUS_ORDER.indexOf(simulatedStatus as any),
    [simulatedStatus],
  );

  const progressPercent = useMemo(
    () =>
      currentIndex < 0
        ? 0
        : Math.round((currentIndex / VISIBLE_STATUS_ORDER.length) * 100),
    [currentIndex],
  );

  useEffect(() => {
    db.collection(collectionNames.ORDERS).subscribe(
      "*",
      function () {
        console.log("first");
        refetchOrder();
      },
      {
        /* other options like expand, custom headers, etc. */
      },
    );

    // return () => {
    //   db.collection(collectionNames.ORDERS).unsubscribe();
    // };
  }, [refetchOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700 overflow-visible">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Track Order
                </h2>
                {isLoading ? (
                  <div className="mt-2">
                    <Skeleton className="h-4 w-36" />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Order ID: <span className="font-mono">{order?.id}</span>
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Progress
                </p>
                {isLoading ? (
                  <Skeleton className="h-6 w-12 mx-auto" />
                ) : (
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {progressPercent}%
                  </p>
                )}
              </div>
            </div>

            {isCancelled ? (
              <CancelledOrderView
                order={order}
                onRefresh={() => refetchOrder()}
                isFetching={isFetching}
              />
            ) : (
              <>
                <div className="flex gap-8">
                  <div className="relative w-12 flex flex-col items-center">
                    <div className="absolute top-6 bottom-6 left-1/2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${progressPercent}%` }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="absolute left-1/2 transform -translate-x-1/2 bottom-6 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded"
                    />

                    <div className="space-y-6 w-full">
                      {VISIBLE_STATUS_ORDER.map((s, idx) => {
                        const isSpecial = SPECIAL_NO_ACTIVE_SET.has(
                          s as Order["status"],
                        );
                        const active = idx === currentIndex && !isSpecial;
                        const done =
                          idx < currentIndex ||
                          (idx === currentIndex && isSpecial);
                        let meta = STATUS_META[s];
                        const isSelfPickup = !order?.deliveryAddress;
                        if (s === "delivering" && isSelfPickup) {
                          meta = {
                            ...meta,
                            label: "Ready for pickup",
                            icon: <Package className="w-5 h-5" />,
                            color: "bg-emerald-500",
                          };
                        }
                        return isLoading ? (
                          <div
                            key={s}
                            className="flex items-center justify-center"
                          >
                            <div className="relative z-10">
                              <Skeleton className="h-11 w-11 rounded-full" />
                            </div>
                          </div>
                        ) : (
                          <div
                            key={s}
                            className="flex items-center justify-center"
                          >
                            <div className="relative z-10">
                              <motion.div
                                animate={{
                                  scale: active ? 1.12 : done ? 1.05 : 1,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 320,
                                  damping: 22,
                                }}
                                className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-lg ${active ? "ring-4 ring-gray-200 dark:ring-emerald-900 bg-gray-500" : done ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-white ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"}`}
                              >
                                <div
                                  className={`${done || active ? "text-white" : "text-gray-400 dark:text-gray-400"}`}
                                >
                                  {meta.icon}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-6">
                      {VISIBLE_STATUS_ORDER.map((s, idx) => {
                        const isSpecial = SPECIAL_NO_ACTIVE_SET.has(
                          s as Order["status"],
                        );
                        const active = idx === currentIndex && !isSpecial;
                        const done =
                          idx < currentIndex ||
                          (idx === currentIndex && isSpecial);
                        let meta = STATUS_META[s];
                        const isSelfPickup = !order?.deliveryAddress;
                        if (s === "delivering" && isSelfPickup) {
                          meta = {
                            ...meta,
                            label: "Ready for pickup",
                            icon: <Package className="w-5 h-5" />,
                            color: "bg-emerald-500",
                          };
                        }
                        return isLoading ? (
                          <div key={s} className="flex items-start gap-4">
                            <div className="flex-1">
                              <Skeleton className="h-4 w-40" />
                              <div className="mt-2">
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                            <div className="w-28 text-right">
                              <Skeleton className="h-4 w-12 ml-auto" />
                            </div>
                          </div>
                        ) : (
                          <div key={s} className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`text-sm font-semibold ${done || active ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                                >
                                  {meta.label}
                                </h4>
                                <div className="text-xs text-slate-400"></div>
                              </div>
                              <p
                                className={`text-sm mt-1 ${done ? "text-slate-600 dark:text-slate-300" : active ? "text-amber-600 dark:text-amber-400 font-medium" : "text-slate-400 dark:text-slate-500"}`}
                              >
                                {done
                                  ? "Completed"
                                  : active
                                    ? "In progress"
                                    : "Pending"}
                              </p>
                            </div>
                            <div className="w-28 text-right">
                              {active && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-xs text-amber-600 font-medium"
                                >
                                  Active
                                </motion.div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="col-span-2 text-sm text-slate-500 dark:text-slate-400">
                    {isLoading ? (
                      <div>
                        <Skeleton className="h-4 w-48" />
                        <div className="mt-2">
                          <Skeleton className="h-4 w-36" />
                        </div>
                      </div>
                    ) : isError ? (
                      <div className="text-red-500">Failed to load order.</div>
                    ) : (
                      <>
                        <div>
                          Last update:{" "}
                          {new Date(
                            order?.updated || Date.now(),
                          ).toLocaleString()}
                        </div>
                        <div className="mt-2">
                          Order total:{" "}
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {new Intl.NumberFormat(undefined, {
                              style: "currency",
                              currency: order?.currency || "USD",
                            }).format(order?.totalAmount || 0)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Order summary
                  </h3>
                  <div className="mt-3 space-y-2">
                    {isLoading
                      ? [1, 2].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <div className="text-sm text-slate-700 dark:text-slate-200">
                              <Skeleton className="h-4 w-40" />
                            </div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                        ))
                      : (order?.items || []).map((it: any) => (
                          <div
                            key={it.id}
                            className="flex items-center justify-between"
                          >
                            <div className="text-sm text-slate-700 dark:text-slate-200">
                              {it.name}{" "}
                              <span className="text-xs text-slate-400">
                                ×{it.quantity}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {new Intl.NumberFormat(undefined, {
                                style: "currency",
                                currency: order?.currency || "USD",
                              }).format((it.price || 0) * (it.quantity || 1))}
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
                {/* Chat floating button + modal */}
                {order?.id && (
                  <>
                    <ChatButton
                      unreadCount={unread}
                      onClick={() => setChatOpen(true)}
                    />
                    <ChatModal
                      orderId={order.id}
                      open={chatOpen}
                      onClose={() => setChatOpen(false)}
                    />
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
