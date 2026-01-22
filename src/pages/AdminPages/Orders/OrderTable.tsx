/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowUpDown,
  ChevronDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Star,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import type { Order } from "@/types";
import { dateFormatter } from "@/utils/utils";

interface OrderTableProps {
  orders: Partial<Order>[];
  statusConfig: any;
  paymentStatusConfig: any;
  onSelect: (order: Partial<Order>) => void;
  onEdit: (order: Partial<Order>) => void;
  onDelete: (order: Partial<Order>) => void;
  onBulkAction?: (selectedOrders: string[], action: string) => void;
  loading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  statusConfig,
  paymentStatusConfig,
  onSelect,
  onEdit,
  onDelete,
  onBulkAction,
  loading = false,
  searchQuery = "",
  onSearchChange,
}) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "ETB",
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

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - new Date(date).getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id!));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleRowExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const sortedOrders = React.useMemo(() => {
    if (!sortConfig) return orders;

    return [...orders].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Order];
      const bValue = b[sortConfig.key as keyof Order];

      if (aValue! < bValue!) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue! > bValue!) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [orders, sortConfig]);

  const getStatusProgress = (status: string) => {
    const statusOrder = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getPriorityColor = (order: Partial<Order>) => {
    const orderTime = new Date(order.created!).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - orderTime) / (1000 * 60 * 60);

    if (hoursDiff > 2) return "border-l-red-500";
    if (hoursDiff > 1) return "border-l-yellow-500";
    return "border-l-green-500";
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Enhanced Header with Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 w-80 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Enhanced Bulk Actions Bar */}
        <div className="flex md:hidden">
          <AnimatePresence>
            {selectedOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedOrders.length}
                    </div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {selectedOrders.length} order
                      {selectedOrders.length > 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBulkAction?.(selectedOrders, "export")}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBulkAction?.(selectedOrders, "archive")}
                      className="gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Archive
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onBulkAction?.(selectedOrders, "delete")}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrders([])}
                      className="gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Clear
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white  dark:bg-gray-800 rounded-md border border-gray-300/50 dark:border-gray-700/50 shadow overflow-hidden backdrop-blur-sm">
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Loading orders...
                </span>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 hover:from-gray-100 hover:to-gray-100 dark:hover:to-gray-700/50 dark:hover:to-gray-700/50 border-b border-gray-200/50 dark:border-gray-700/50">
                <TableHead className="w-12 pl-6">
                  <Checkbox
                    checked={
                      selectedOrders.length === orders.length &&
                      orders.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all orders"
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("id")}
                    className="h-auto p-0 font-semibold hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Order
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("created")}
                    className="h-auto p-0 font-semibold hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Date & Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                  Payment
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200">
                  Items
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("totalAmount")}
                    className="h-auto p-0 font-semibold hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {sortedOrders.map((order, index) => {
                  const StatusIcon = statusConfig[order.status!]?.icon;
                  const PaymentIcon =
                    paymentStatusConfig[order.paymentStatus!]?.icon;
                  const isExpanded = expandedRows.has(order.id!);
                  //   const priorityColor = getPriorityColor(order);

                  return (
                    <React.Fragment key={order.id}>
                      <motion.tr
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.03 }}
                        className={`group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200 cursor-pointer  ${
                          hoveredRow === order.id ? "shadow-lg" : ""
                        }`}
                        onClick={() => onSelect(order)}
                        onMouseEnter={() => setHoveredRow(order.id!)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <TableCell
                          onClick={(e) => e.stopPropagation()}
                          className="pl-6"
                        >
                          <Checkbox
                            checked={selectedOrders.includes(order.id!)}
                            onCheckedChange={(checked) =>
                              handleSelectOrder(order.id!, checked as boolean)
                            }
                            aria-label={`Select order ${order.id}`}
                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                #{order.id?.slice(-4)}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">
                                #{order.id}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {getRelativeTime(new Date(order.created!))}
                                </span>
                              </div>
                              {order.notes && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32 mt-1">
                                      📝 {order.notes}
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{order.notes}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-700">
                                <AvatarImage src={order.customer?.avatar} />
                                <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                                  {order.customer?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {order.customer?.isVip && (
                                <div className="absolute -top-1 -right-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                  {order.customer?.name}
                                </p>
                                {order.customer?.isVip && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  >
                                    VIP
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {order.customer?.email}
                              </p>
                              {order.customer?.phone && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  📞 {order.customer.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {formatDate(new Date(order.created!))}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(order.created!).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>
                            {order.estimatedDelivery && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <TrendingUp className="w-3 h-3" />
                                <span>
                                  ETA:{" "}
                                  {dateFormatter({
                                    date: order.estimatedDelivery!,
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-2">
                            <Badge
                              className={`${
                                statusConfig[order.status!]?.color
                              } border-0 shadow-sm`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1.5" />
                              {`${
                                order.status?.charAt(0).toUpperCase() ?? ""
                              }${order.status?.slice(1)}`}
                            </Badge>
                            <div className="w-full">
                              <Progress
                                value={getStatusProgress(order.status!)}
                                className="h-1.5"
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className={`${
                                paymentStatusConfig[order.paymentStatus!]?.color
                              } shadow-sm`}
                            >
                              <PaymentIcon className="h-3 w-3 mr-1.5" />
                              {`${
                                order.paymentStatus?.charAt(0)?.toUpperCase() ??
                                ""
                              }${order.paymentStatus?.slice(1)}`}
                            </Badge>
                            {order.paymentMethod && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <CreditCard className="w-3 h-3" />
                                <span>{order.paymentMethod}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2.5 py-1.5">
                              <ShoppingBag className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {order?.items?.length}
                              </span>
                              <span className="text-gray-500 text-xs">
                                item{order?.items?.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(order.id!);
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronDown
                                className={`h-3 w-3 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">
                              {formatCurrency(
                                Number(order.totalAmount),
                                order.currency!,
                              )}
                            </p>
                            {Number(order.discountAmount) > 0 && (
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  -
                                  {formatCurrency(
                                    order.discountAmount!,
                                    order.currency!,
                                  )}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                >
                                  SAVED
                                </Badge>
                              </div>
                            )}
                            {/* {!order.tip && Number(order.tip) > 0 && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                +
                                {formatCurrency(
                                  Number(order.tip),
                                  order.currency!
                                )}{" "}
                                tip
                              </p>
                            )} */}
                          </div>
                        </TableCell>

                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm"
                            >
                              <DropdownMenuItem
                                onClick={() => onSelect(order)}
                                className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              >
                                <Eye className="h-4 w-4 text-blue-500" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onEdit(order)}
                                className="gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              >
                                <Edit className="h-4 w-4 text-green-500" />
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                <Package className="h-4 w-4 text-purple-500" />
                                Track Package
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                                <Download className="h-4 w-4 text-orange-500" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                Report Issue
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDelete(order)}
                                className="gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>

                      {/* Expandable Row Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <TableCell colSpan={9} className="p-0 border-0">
                              <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                exit={{ y: -20 }}
                                className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20 p-6 border-t border-gray-100 dark:border-gray-700"
                              >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  {/* Order Items */}
                                  <div className="lg:col-span-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                      <ShoppingBag className="w-4 h-4 text-blue-500" />
                                      Order Items
                                    </h4>
                                    <div className="space-y-3">
                                      {order.items?.map((item, itemIndex) => (
                                        <motion.div
                                          key={itemIndex}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: itemIndex * 0.1,
                                          }}
                                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                                              <Package className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                              <p className="font-medium text-gray-900 dark:text-white">
                                                {item.name}
                                              </p>
                                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Qty: {item.quantity} ×{" "}
                                                {formatCurrency(
                                                  item.price,
                                                  order.currency!,
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                              {formatCurrency(
                                                item.price * item.quantity,
                                                order.currency!,
                                              )}
                                            </p>
                                            {item.discount && (
                                              <p className="text-xs text-green-600 dark:text-green-400">
                                                -
                                                {formatCurrency(
                                                  item.discount,
                                                  order.currency!,
                                                )}
                                              </p>
                                            )}
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Order Summary & Customer Info */}
                                  <div className="space-y-6">
                                    {/* Customer Details */}
                                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-500" />
                                        Customer Details
                                      </h5>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="text-gray-500 dark:text-gray-400">
                                            Name:
                                          </span>
                                          <span className="font-medium text-gray-900 dark:text-white">
                                            {order.customer?.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-gray-500 dark:text-gray-400">
                                            Email:
                                          </span>
                                          <span className="text-gray-900 dark:text-white">
                                            {order.customer?.email}
                                          </span>
                                        </div>
                                        {order.customer?.phone && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-gray-500 dark:text-gray-400">
                                              Phone:
                                            </span>
                                            <span className="text-gray-900 dark:text-white">
                                              {order.customer.phone}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {order.deliveryAddress && (
                                      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-green-500" />
                                          Delivery Address
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                          {order.deliveryAddress.street}
                                          <br />
                                          {order.deliveryAddress.city},{" "}
                                          {order.deliveryAddress.state}{" "}
                                          {order.deliveryAddress.zipCode}
                                        </p>
                                        {order.deliveryAddress.instructions && (
                                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                              <strong>Instructions:</strong>{" "}
                                              {
                                                order.deliveryAddress
                                                  .instructions
                                              }
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Order Summary */}
                                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-purple-500" />
                                        Order Summary
                                      </h5>
                                      <div className="space-y-2 text-sm">
                                        {Number(order.deliveryFee) > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                              Delivery:
                                            </span>
                                            <span className="text-gray-900 dark:text-white">
                                              {formatCurrency(
                                                Number(order.deliveryFee),
                                                order.currency!,
                                              )}
                                            </span>
                                          </div>
                                        )}
                                        {Number(order.discountAmount) > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                              Discount:
                                            </span>
                                            <span className="text-green-600 dark:text-green-400">
                                              -
                                              {formatCurrency(
                                                Number(order.discountAmount),
                                                order.currency!,
                                              )}
                                            </span>
                                          </div>
                                        )}

                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                                          <div className="flex justify-between font-semibold">
                                            <span className="text-gray-900 dark:text-white">
                                              Total:
                                            </span>
                                            <span className="text-gray-900 dark:text-white text-lg">
                                              {formatCurrency(
                                                Number(order.totalAmount),
                                                order.currency!,
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      toggleRowExpansion(order.id!)
                                    }
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    Collapse
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => onEdit(order)}
                                    className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-purple-700"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Order
                                  </Button>
                                </div>
                              </motion.div>
                            </TableCell>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:to-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No orders match your search for "${searchQuery}"`
                : "There are no orders to display at the moment."}
            </p>
            {searchQuery && onSearchChange && (
              <Button
                variant="outline"
                onClick={() => onSearchChange("")}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <div className="hidden md:flex">
        <AnimatePresence>
          {selectedOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 min-w-1/2"
            >
              <div className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 backdrop-blur-lg bg-white/95 dark:bg-gray-800/95">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {selectedOrders.length}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedOrders.length} order
                      {selectedOrders.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBulkAction?.(selectedOrders, "export")}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBulkAction?.(selectedOrders, "archive")}
                      className="gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Archive
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onBulkAction?.(selectedOrders, "update_status")
                      }
                      className="hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Update Status
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onBulkAction?.(selectedOrders, "delete")}
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrders([])}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );

  function getStatusIcon(status: string) {
    const iconMap: Record<string, React.ComponentType<any>> = {
      pending: Clock,
      confirmed: CheckCircle2,
      preparing: Loader2,
      ready: Package,
      delivered: CheckCircle2,
      cancelled: XCircle,
    };
    return iconMap[status] || Clock;
  }

  function getPaymentIcon(paymentStatus: string) {
    const iconMap: Record<string, React.ComponentType<any>> = {
      paid: CheckCircle2,
      pending: Clock,
      failed: XCircle,
      refunded: RefreshCw,
    };
    return iconMap[paymentStatus] || CreditCard;
  }
};
