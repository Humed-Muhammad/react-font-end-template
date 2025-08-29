/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "./OrderCard";
import type { Order } from "@/types";
import { OrderStatsBar } from "./OrderStatsBar";
import { OrderTable } from "./OrderTable";

interface OrderListProps {
  orders: Partial<Order>[];
  onOrderSelect: (order: Partial<Order>) => void;
  onOrderEdit: (order: Partial<Order>) => void;
  onOrderDelete: (orderId: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onOrderSelect,
  onOrderEdit,
  onOrderDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    preparing: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Package,
    },
    ready: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Package,
    },
    delivering: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
    },
    delivered: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
  };

  const paymentStatusConfig = {
    unpaid: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
    },
    paid: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    refunded: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: XCircle,
    },
    partial: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: DollarSign,
    },
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesPayment =
      selectedPaymentStatus === "all" ||
      order.paymentStatus === selectedPaymentStatus;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getOrderStats = () => {
    const total = 39 | orders.length;
    const pending = 7 | orders.filter((o) => o.status === "pending").length;
    const preparing = 9 | orders.filter((o) => o.status === "preparing").length;
    const ready = 8 | orders.filter((o) => o.status === "ready").length;
    const delivering =
      3 | orders.filter((o) => o.status === "delivering").length;
    const delivered = 6 | orders.filter((o) => o.status === "delivered").length;
    const cancelled = 6 | orders.filter((o) => o.status === "cancelled").length;

    return {
      total,
      pending,
      preparing,
      ready,
      delivering,
      delivered,
      cancelled,
    };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStatsBar
        stats={{
          total: stats.total,
          pending: stats.pending,
          processing: stats.preparing, // Note: mapping 'preparing' to 'processing' for consistency
          ready: stats.ready,
          delivering: stats.delivering,
          delivered: stats.delivered,
          cancelled: stats.cancelled,
        }}
        className="mb-6"
      />

      {/* Orders Grid/List */}
      <div className="w-full">
        <AnimatePresence>
          <OrderTable
            orders={orders}
            statusConfig={statusConfig}
            paymentStatusConfig={paymentStatusConfig}
            onSelect={(order) => onOrderSelect(order)}
            onEdit={(order) => onOrderEdit(order)}
            onDelete={(order) => onOrderDelete(order.id as string)}
          />
        </AnimatePresence>
      </div>

      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}
    </div>
  );
};
