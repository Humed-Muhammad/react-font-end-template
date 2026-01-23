import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";

type Props = {
  order?: Partial<Order> | null;
  onRefresh?: () => void;
  isFetching?: boolean;
};

export default function CancelledOrderView({
  order,
  isFetching,
  onRefresh,
}: Props) {
  return (
    <div className="py-8 px-4 text-center">
      <div className="inline-flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 p-4 mb-4">
        <XCircle className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Order Cancelled
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
        This order has been cancelled{order?.id ? ` — ${order.id}` : ""}.
      </p>

      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        <div>
          Last update: {new Date(order?.updated || Date.now()).toLocaleString()}
        </div>
        <div className="mt-2">
          Order total:{" "}
          <span className="font-medium text-slate-900 dark:text-white">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: order?.currency || "USD",
            }).format(order?.totalAmount || 0)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
