import type { Stats, StatsKeys } from "@/types";
import { AlertCircle, CheckCircle, DollarSign, Package } from "lucide-react";
import { useMemo } from "react";

const placeHolder = [
  {
    title: "Total Products",
    value: "",
    icon: Package,
    color: "from-blue-500 to-cyan-500",
    change: "+12%",
    key: "totalProducts",
  },
  {
    title: "Active Products",
    value: "",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500",
    change: "+8%",
    key: "activeProducts",
  },
  {
    title: "Total Value",
    value: ``,
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
    change: "+15%",
    key: "totalValue",
  },
  {
    title: "Low Stock",
    value: "",
    icon: AlertCircle,
    color: "from-orange-500 to-red-500",
    change: "-5%",
    key: "lowStockProducts",
  },
];
export const useProductStats = (stats: Stats | undefined) => {
  const addedEnhancement = useMemo(() => {
    return placeHolder.map((p) => {
      const values = stats?.[`${p.key}` as StatsKeys];
      return {
        ...p,
        value: values?.value,
        change: values?.change,
      };
    });
  }, [stats]);
  return { addedEnhancement };
};
