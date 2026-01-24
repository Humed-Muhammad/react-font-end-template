import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Bike,
  ChefHat,
  PackageCheck,
  CheckCheck,
} from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready?: number;
  delivering?: number;
  delivered: number;
  cancelled?: number;
}

interface OrderStatsBarProps {
  stats: OrderStats;
  className?: string;
}

export const OrderStatsBar: React.FC<OrderStatsBarProps> = ({
  stats,
  className = "",
}) => {
  const statsData = [
    {
      label: "Pending",
      value: stats.pending,
      color: "bg-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/10",
      textColor: "text-amber-700 dark:text-amber-400",
      icon: Clock,
      percentage: stats.total > 0 ? (stats.pending / stats.total) * 100 : 0,
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      color: "bg-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/10",
      textColor: "text-teal-700 dark:text-teal-400",
      icon: CheckCheck,
      percentage: stats.total > 0 ? (stats.confirmed / stats.total) * 100 : 0,
    },
    {
      label: "Preparing",
      value: stats.preparing,
      color: "bg-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      textColor: "text-blue-700 dark:text-blue-400",
      icon: ChefHat,
      percentage: stats.total > 0 ? (stats.preparing / stats.total) * 100 : 0,
    },
    {
      label: "Ready",
      value: stats.ready || 0,
      color: "bg-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/10",
      textColor: "text-indigo-700 dark:text-indigo-400",
      icon: PackageCheck,
      percentage:
        stats.total > 0 ? ((stats.ready || 0) / stats.total) * 100 : 0,
    },
    {
      label: "Delivering",
      value: stats.delivering || 0,
      color: "bg-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
      textColor: "text-purple-700 dark:text-purple-400",
      icon: Bike,
      percentage:
        stats.total > 0 ? ((stats.delivering || 0) / stats.total) * 100 : 0,
    },
    {
      label: "Delivered",
      value: stats.delivered,
      color: "bg-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
      textColor: "text-emerald-700 dark:text-emerald-400",
      icon: CheckCircle,
      percentage: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
    },
    {
      label: "Cancelled",
      value: stats.cancelled || 0,
      color: "bg-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/10",
      textColor: "text-red-700 dark:text-red-400",
      icon: XCircle,
      percentage:
        stats.total > 0 ? ((stats.cancelled || 0) / stats.total) * 100 : 0,
    },
  ];

  return (
    <div className={`${className}`}>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Orders Overview
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              total
            </span>
          </div>
        </div>

        {/* Compact Stats Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl ${stat.bgColor} hover:scale-105 transition-all duration-200 cursor-pointer group`}
            >
              <div
                className={`w-7 h-7 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-semibold ${stat.textColor}`}>
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </span>
              </div>
              <div
                className={`text-xs px-1.5 py-0.5 rounded-md bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                {stat.percentage.toFixed(1)}%
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Progress Bar */}
        {/* <div className="mt-4">
          <div className="flex h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            {statsData.map((stat, index) => (
              <Tooltip key={stat.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className={`${stat.color} transition-all duration-300 cursor-pointer hover:opacity-80`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-medium">{stat.label}</p>
                    <p className="text-sm text-gray-300">
                      {stat.value} orders ({stat.percentage.toFixed(1)}%)
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};
