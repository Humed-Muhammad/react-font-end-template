import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrderList } from "./OrderList";
import type { Order } from "@/types";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import { AdminDashboardNav } from "@/components/AdminDashboardNav";
import { useGetOrdersQuery } from "./services";

export const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Partial<Order>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useGetOrdersQuery({
    page: 1,
    perPage: 10,
  });

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

  if (isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <AdminDashboardNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order List */}
        <OrderList
          orders={data?.items ?? []}
          onOrderSelect={handleOrderSelect}
          onOrderEdit={handleOrderEdit}
          onOrderDelete={handleOrderDelete}
        />
      </div>
    </div>
  );
};
