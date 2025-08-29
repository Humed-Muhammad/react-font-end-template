/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Order } from "@/types";

interface OrderCardProps {
  order: Partial<Order>;
  viewMode: "grid" | "list";
  statusConfig: any;
  paymentStatusConfig: any;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  viewMode,
  statusConfig,
  paymentStatusConfig,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const StatusIcon = statusConfig[order.status!]?.icon;
  const PaymentIcon = paymentStatusConfig[order.paymentStatus!]?.icon;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="bg-white dark:bg-gray-800 border-0 shadow hover:shadow-md transition-all duration-300 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  #{order.id?.slice(-4)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      Order #{order.id}
                    </h3>
                    <Badge
                      className={`${statusConfig[order.status!]?.color} border`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {`${order?.status
                        ?.charAt(0)
                        ?.toUpperCase()} ${order?.status?.slice(1)}`}
                    </Badge>
                    <Badge
                      className={`${
                        paymentStatusConfig[order.paymentStatus!]?.color
                      } border`}
                    >
                      <PaymentIcon className="h-3 w-3 mr-1" />
                      {`${order.paymentStatus
                        ?.charAt(0)
                        ?.toUpperCase()} ${order.paymentStatus?.slice(1)}`}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{order.customer?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(new Date(order.created!))}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" />
                      <span>{order?.items?.length} items</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(order.totalAmount!, order.currency!)}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onSelect}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Order
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <Card className="bg-white dark:bg-gray-800 border-0 shadow hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                #{order.id?.slice(-4)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Order #{order.id}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(new Date(order.created!))}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onSelect}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {order.customer?.name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {order?.items?.length} items
              </span>
            </div>

            {order.notes && (
              <div className="flex items-start gap-2 text-sm">
                <Package className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {order.notes}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <Badge className={`${statusConfig[order.status!]?.color} border`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {`${order.status?.charAt(0).toUpperCase()}` +
                  order.status?.slice(1)}
              </Badge>
              <Badge
                className={`${
                  paymentStatusConfig[order.paymentStatus!]?.color
                } border`}
              >
                <PaymentIcon className="h-3 w-3 mr-1" />
                {`${order.paymentStatus?.charAt(0)?.toUpperCase() || ""}` +
                  order.paymentStatus?.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Number(order.shippingCost) > 0 && (
                  <p>
                    Shipping:{" "}
                    {formatCurrency(order.shippingCost!, order.currency!)}
                  </p>
                )}
                {Number(order.discountAmount) > 0 && (
                  <p className="text-green-600">
                    Discount: -
                    {formatCurrency(order.discountAmount!, order.currency!)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(Number(order.totalAmount), order.currency!)}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
