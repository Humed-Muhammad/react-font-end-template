import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  ChefHat,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/constant";

interface OrderTrackingProps {
  orderId: string;
}

const iconMap = {
  Clock,
  CheckCircle,
  ChefHat,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
};

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate real-time updates (replace with actual Firebase listener)
  useEffect(() => {
    const fetchOrder = async () => {
      // Replace with actual Firebase query
      // const orderDoc = await getDoc(doc(db, 'orders', orderId));
      // setOrder(orderDoc.data() as Order);

      // Mock data for demonstration
      const mockOrder: Order = {
        id: orderId,
        customerId: "customer123",
        businessId: "business123",
        items: [
          { id: "1", name: "Burger Combo", quantity: 2, price: 15.99 },
          { id: "2", name: "Fries", quantity: 1, price: 4.99 },
        ],
        totalAmount: 36.97,
        currentStatus: "ready",
        statusHistory: [
          {
            id: "pending",
            label: "Order Received",
            description: "Your order has been received",
            color: "bg-yellow-500",
            icon: "Clock",
            isActive: false,
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
          },
          {
            id: "confirmed",
            label: "Order Confirmed",
            description: "Your order has been confirmed",
            color: "bg-blue-500",
            icon: "CheckCircle",
            isActive: false,
            timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
          },
          {
            id: "preparing",
            label: "Preparing",
            description: "Your order is being prepared",
            color: "bg-orange-500",
            icon: "ChefHat",
            isActive: true,
            timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
            estimatedTime: "10-15 minutes",
          },
        ],
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000), // 20 mins from now
      };

      setOrder(mockOrder);
      setLoading(false);
    };

    fetchOrder();

    // Set up real-time listener (replace with actual Firebase listener)
    // const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
    //   setOrder(doc.data() as Order);
    // });

    // return () => unsubscribe();
  }, [orderId]);

  const getStatusProgress = (currentStatus: string) => {
    const statusOrder = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">Order not found</p>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-3">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Order #{order.id.slice(-6)}
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Placed on {order.createdAt.toLocaleDateString()}
              </p>
            </div>
            <Badge
              className={`${
                ORDER_STATUSES[
                  order.currentStatus.toUpperCase() as keyof typeof ORDER_STATUSES
                ]?.color
              } text-white`}
            >
              {
                ORDER_STATUSES[
                  order.currentStatus.toUpperCase() as keyof typeof ORDER_STATUSES
                ]?.label
              }
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Order Progress</span>
              <span>
                {Math.round(getStatusProgress(order.currentStatus))}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${getStatusProgress(order.currentStatus)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && (
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <Clock className="h-4 w-4" />
              <span>
                Estimated delivery:{" "}
                {order.estimatedDelivery.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.statusHistory.map((status, index) => {
              const IconComponent =
                iconMap[status.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={status.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-4 p-4 rounded-lg ${
                    status.isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${status.color} text-white`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {status.label}
                      </h3>
                      {status.timestamp && (
                        <span className="text-sm text-slate-500">
                          {status.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {status.description}
                    </p>
                    {status.estimatedTime && (
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1">
                        Estimated time: {status.estimatedTime}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Quantity: {item.quantity}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-slate-500 italic">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-lg text-slate-900 dark:text-white">
                Total
              </span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Call Restaurant</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Live Chat</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Track Delivery</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
