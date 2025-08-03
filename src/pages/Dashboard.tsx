import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  Bell,
  Search,
  Filter,
  Calendar,
  MoreVertical,
  Plus,
  Star,
  Clock,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Award,
  ChefHat,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { NotificationCenter } from "./NotificationCenter";
import { useDisclosure } from "@/hooks/useDisclosure";
import { db } from "@/utils/pockatbase";
import { useNavigate } from "react-router-dom";
import { AdminDashboardNav } from "@/components/AdminDashboardNav";

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  time: string;
  avatar?: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  orders: number;
  rating: number;
  image?: string;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  aovChange: number;
}

export const Dashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const notificationController = useDisclosure();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Mock data
  const [analytics] = useState<Analytics>({
    totalRevenue: 12450.75,
    totalOrders: 156,
    activeCustomers: 89,
    averageOrderValue: 79.81,
    revenueChange: 12.5,
    ordersChange: 8.3,
    customersChange: -2.1,
    aovChange: 5.7,
  });

  const [recentOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: "Sarah Johnson",
      items: 3,
      total: 45.99,
      status: "preparing",
      time: "2 min ago",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: "ORD-002",
      customer: "Mike Chen",
      items: 2,
      total: 28.5,
      status: "ready",
      time: "5 min ago",
    },
    {
      id: "ORD-003",
      customer: "Emma Wilson",
      items: 4,
      total: 67.25,
      status: "delivered",
      time: "12 min ago",
    },
    {
      id: "ORD-004",
      customer: "David Brown",
      items: 1,
      total: 15.99,
      status: "pending",
      time: "18 min ago",
    },
  ]);

  const [topMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      category: "Pizza",
      price: 18.99,
      orders: 45,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Caesar Salad",
      category: "Salads",
      price: 12.99,
      orders: 32,
      rating: 4.6,
    },
    {
      id: "3",
      name: "Beef Burger",
      category: "Burgers",
      price: 15.99,
      orders: 28,
      rating: 4.7,
    },
  ]);

  const getStatusColor = (status: Order["status"]) => {
    switch (true) {
      case status == "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case status == "preparing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case status == "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case status == "delivered":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case status == "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <AdminDashboardNav />

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50"
                />
              </div>

              <Button
                onClick={notificationController.onOpen}
                variant="outline"
                size="icon"
                className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/api/placeholder/32/32" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      db.authStore.clear();
                      navigate("/");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Welcome back! Here's what's happening with your restaurant
                today.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {selectedTimeRange === "today"
                      ? "Today"
                      : selectedTimeRange}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setSelectedTimeRange("today")}
                  >
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedTimeRange("week")}
                  >
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedTimeRange("month")}
                  >
                    This Month
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>
          </motion.div>

          {/* Analytics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Total Revenue",
                value: `$${analytics.totalRevenue.toLocaleString()}`,
                change: analytics.revenueChange,
                icon: DollarSign,
                color: "from-emerald-500 to-teal-500",
              },
              {
                title: "Total Orders",
                value: analytics.totalOrders.toString(),
                change: analytics.ordersChange,
                icon: ShoppingCart,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Active Customers",
                value: analytics.activeCustomers.toString(),
                change: analytics.customersChange,
                icon: Users,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Avg Order Value",
                value: `$${analytics.averageOrderValue.toFixed(2)}`,
                change: analytics.aovChange,
                icon: Target,
                color: "from-orange-500 to-red-500",
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {metric.value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      {metric.change > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ml-1 ${
                          metric.change > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(metric.change)}% from last period
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Revenue Overview
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Export Data</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Chart visualization would go here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "Orders Today",
                      value: "23",
                      icon: Activity,
                      color: "text-blue-500",
                    },
                    {
                      label: "Peak Hour",
                      value: "12-1 PM",
                      icon: Clock,
                      color: "text-green-500",
                    },
                    {
                      label: "Avg Prep Time",
                      value: "12 min",
                      icon: Zap,
                      color: "text-yellow-500",
                    },
                    {
                      label: "Customer Rating",
                      value: "4.8",
                      icon: Star,
                      color: "text-purple-500",
                    },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Orders and Top Menu Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Recent Orders
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={order.avatar} />
                            <AvatarFallback>
                              {order.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {order.customer}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {order.items} items • ${order.total}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {order.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Menu Items */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Top Products
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View Products
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topMenuItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.category} • ${item.price}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">
                              {item.rating}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {item.orders} orders
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Order Completion Rate",
                      value: 94,
                      target: 95,
                      color: "bg-green-500",
                      icon: CheckCircle2,
                    },
                    {
                      title: "Customer Satisfaction",
                      value: 87,
                      target: 90,
                      color: "bg-blue-500",
                      icon: Award,
                    },
                    {
                      title: "Kitchen Efficiency",
                      value: 78,
                      target: 85,
                      color: "bg-orange-500",
                      icon: ChefHat,
                    },
                  ].map((metric, index) => (
                    <div key={metric.title} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <metric.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {metric.title}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {metric.value}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={metric.value} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Current: {metric.value}%</span>
                          <span>Target: {metric.target}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Items */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Add Product",
                      icon: Plus,
                      color: "from-green-500 to-emerald-500",
                    },
                    {
                      label: "View Analytics",
                      icon: BarChart3,
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      label: "Manage Staff",
                      icon: Users,
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      label: "Settings",
                      icon: Filter,
                      color: "from-orange-500 to-red-500",
                    },
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`cursor-pointer p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      <action.icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <NotificationCenter
        {...notificationController}
        notifications={notifications}
        onMarkAsRead={console.log}
        onMarkAllAsRead={console.log}
        onDelete={console.log}
        onClearAll={console.log}
      />
    </div>
  );
};

export default Dashboard;
