import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrderList } from "./OrderList";
import type { Order } from "@/types";
import { LoadingComponent } from "@/components/shared/LoadingComponent";

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Partial<Order>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development - replace with actual API calls
  const mockOrders: Partial<Order>[] = [
    {
      id: "ORD-001",
      customer: {
        id: "CUST-001",
        name: "John Doe",
      },
      deliveryAddress: {
        id: "ADD-001",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
      items: [
        {
          order: "ORD-001",
          product: "PROD-001",
          variant: "VAR-001",
          name: "Premium Coffee Beans",
          sku: "PCB-001",
          quantity: 2,
          price: 25.99,
          totalPrice: 51.98,
          snapshot: { size: "1kg", roast: "medium" },
          image: "/api/placeholder/100/100",
          discount: 10,
        },
      ],
      totalAmount: 51.98,
      status: "pending",
      paymentStatus: "unpaid",

      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      customerNotes: "Please deliver after 2 PM",
    },
    {
      id: "ORD-002",
      customer: {
        id: "CUST-001",
        name: "John Doe",
      },
      items: [
        {
          order: "ORD-002",
          product: "PROD-002",
          variant: "VAR-002",
          name: "Artisan Pastries",
          sku: "AP-002",
          quantity: 6,
          price: 4.5,
          totalPrice: 27.0,
          snapshot: { type: "croissant", flavor: "chocolate" },
          image: "/api/placeholder/100/100",
        },
      ],
      totalAmount: 27.0,
      status: "preparing",
      paymentStatus: "paid",

      created: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      updated: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "ORD-003",
      customer: {
        id: "CUST-001",
        name: "John Doe",
      },
      items: [
        {
          order: "ORD-003",
          product: "PROD-003",
          variant: "VAR-003",
          name: "Specialty Tea Set",
          sku: "STS-003",
          quantity: 1,
          price: 89.99,
          totalPrice: 89.99,
          snapshot: { type: "earl grey", size: "premium" },
          image: "/api/placeholder/100/100",
        },
      ],
      totalAmount: 89.99,
      status: "delivered",
      paymentStatus: "paid",

      created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await fetch(`${apiPath}/api/collections/${collectionNames.ORDERS}/records`);
        // const data = await response.json();

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setOrders(mockOrders);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderSelect = (order: Partial<Order>) => {
    console.log("Order selected:", order);
    // For now, just log the selection
  };

  const handleOrderEdit = (order: Partial<Order>) => {
    console.log("Edit order:", order);
    // For now, just log the edit action
  };

  const handleOrderDelete = async (orderId: string) => {
    try {
      // Replace with actual API call
      // await fetch(`${apiPath}/api/collections/${collectionNames.ORDERS}/records/${orderId}`, {
      //   method: 'DELETE'
      // });

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      console.log("Order deleted:", orderId);
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order");
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order List */}
        <OrderList
          orders={orders}
          onOrderSelect={handleOrderSelect}
          onOrderEdit={handleOrderEdit}
          onOrderDelete={handleOrderDelete}
        />
      </div>
    </div>
  );
};
