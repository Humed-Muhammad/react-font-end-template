import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Package,
  Users,
  Settings,
  Filter,
  MoreVertical,
  Trash2,
  Archive,
  Volume2,
  VolumeX,
  CheckLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  type:
    | "success"
    | "warning"
    | "error"
    | "info"
    | "order"
    | "customer"
    | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionable?: boolean;
  actions?: {
    label: string;
    action: () => void;
    variant?: "default" | "destructive" | "outline";
  }[];
  metadata?: {
    orderId?: string;
    customerId?: string;
    amount?: number;
    avatar?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "order":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "customer":
        return <Users className="w-5 h-5 text-cyan-500" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50/50 dark:bg-red-900/10";
      case "high":
        return "border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10";
      case "low":
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10";
      default:
        return "border-l-gray-300 bg-gray-50/50 dark:bg-gray-900/10";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab !== "all" && activeTab !== notification.type) return false;
    if (filterPriority !== "all" && filterPriority !== notification.priority)
      return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const containerVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: 300,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 100 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Filter className="w-3 h-3 mr-1" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority("all")}
                      >
                        All Priorities
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority("urgent")}
                      >
                        Urgent
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority("high")}
                      >
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority("medium")}
                      >
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterPriority("low")}
                      >
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-8 h-8"
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={onClearAll}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear all
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="order" className="text-xs">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="customer" className="text-xs">
                    Customers
                  </TabsTrigger>
                  <TabsTrigger value="system" className="text-xs">
                    System
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You're all caught up! Check back later for new updates.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className={`relative border-l-4 rounded-lg p-4 ${getPriorityColor(
                          notification.priority
                        )} ${
                          !notification.read
                            ? "bg-white dark:bg-gray-800 shadow-sm"
                            : "bg-gray-50/50 dark:bg-gray-900/50"
                        } transition-all duration-200 hover:shadow-md`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {notification.message}
                                </p>
                                {notification.metadata && (
                                  <div className="flex items-center space-x-4 mt-2">
                                    {notification.metadata.orderId && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Order #{notification.metadata.orderId}
                                      </span>
                                    )}
                                    {notification.metadata.amount && (
                                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                        $
                                        {notification.metadata.amount.toFixed(
                                          2
                                        )}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 ml-2">
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                      <MoreVertical className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.read ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onMarkAsRead(notification.id)
                                        }
                                      >
                                        <Check className="w-4 h-4 mr-2" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onMarkAsRead(notification.id)
                                        }
                                      >
                                        <CheckLine className="w-4 h-4 mr-2" />
                                        Mark as unread
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <Archive className="w-4 h-4 mr-2" />
                                      Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => onDelete(notification.id)}
                                      className="text-red-600 dark:text-red-400"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* Priority Badge */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    notification.priority === "urgent"
                                      ? "destructive"
                                      : notification.priority === "high"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {notification.priority}
                                </Badge>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              {notification.metadata?.avatar && (
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={notification.metadata.avatar}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {notification.metadata.customerId
                                      ?.slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>

                            {/* Action Buttons */}
                            {notification.actionable &&
                              notification.actions && (
                                <div className="flex items-center space-x-2 mt-3">
                                  {notification.actions.map((action, index) => (
                                    <Button
                                      key={index}
                                      variant={action.variant || "outline"}
                                      size="sm"
                                      onClick={action.action}
                                      className="text-xs h-7"
                                    >
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    className="scale-75"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Sound notifications
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
