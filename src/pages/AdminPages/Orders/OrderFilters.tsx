/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, MapPin, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/DateRangePicker/DateRangePicker";
import { Card, CardContent } from "@/components/ui/card";

interface OrderFiltersProps {
  onFiltersChange?: (filters: OrderFilterState) => void;
  onClearFilters?: () => void;
}

interface OrderFilterState {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  amountRange: {
    min: number;
    max: number;
  };
  customerType: string;
  shippingMethod: string;
  paymentMethod: string;
  location: string;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  onFiltersChange,
  onClearFilters,
}) => {
  const [filters, setFilters] = useState<OrderFilterState>({
    dateRange: { from: null, to: null },
    amountRange: { min: 0, max: 10000 },
    customerType: "all",
    shippingMethod: "all",
    paymentMethod: "all",
    location: "",
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof OrderFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);

    // Track active filters
    if (key === "dateRange" && (value.from || value.to)) {
      if (!activeFilters.includes("dateRange")) {
        setActiveFilters([...activeFilters, "dateRange"]);
      }
    } else if (key === "amountRange" && (value.min > 0 || value.max < 10000)) {
      if (!activeFilters.includes("amountRange")) {
        setActiveFilters([...activeFilters, "amountRange"]);
      }
    } else if (
      value !== "all" &&
      value !== "" &&
      !activeFilters.includes(key)
    ) {
      setActiveFilters([...activeFilters, key]);
    }
  };

  const clearFilter = (filterKey: string) => {
    const newActiveFilters = activeFilters.filter((f) => f !== filterKey);
    setActiveFilters(newActiveFilters);

    let newFilters = { ...filters };
    switch (filterKey) {
      case "dateRange":
        newFilters.dateRange = { from: null, to: null };
        break;
      case "amountRange":
        newFilters.amountRange = { min: 0, max: 10000 };
        break;
      default:
        newFilters = { ...newFilters, [filterKey]: "all" };
    }
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters: OrderFilterState = {
      dateRange: { from: null, to: null },
      amountRange: { min: 0, max: 10000 },
      customerType: "all",
      shippingMethod: "all",
      paymentMethod: "all",
      location: "",
    };
    setFilters(defaultFilters);
    setActiveFilters([]);
    onClearFilters?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active filters:
          </span>
          {activeFilters.map((filter) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm"
            >
              <span className="capitalize">
                {filter.replace(/([A-Z])/g, " $1")}
              </span>
              <button
                onClick={() => clearFilter(filter)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Range */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <DateRangePicker
                initialDateFrom={filters.dateRange.from as Date}
                initialDateTo={filters.dateRange.to as Date}
                align="start"
                locale="en-GB"
                showCompare={true}
                onUpdate={(range) => handleFilterChange("dateRange", range)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amount Range */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Amount Range
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.amountRange.min}
                  onChange={(e) =>
                    handleFilterChange("amountRange", {
                      ...filters.amountRange,
                      min: Number(e.target.value),
                    })
                  }
                  className="w-20"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.amountRange.max}
                  onChange={(e) =>
                    handleFilterChange("amountRange", {
                      ...filters.amountRange,
                      max: Number(e.target.value),
                    })
                  }
                  className="w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Type */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Customer Type
              </Label>
              <Select
                value={filters.customerType}
                onValueChange={(value) =>
                  handleFilterChange("customerType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="new">New Customers</SelectItem>
                  <SelectItem value="returning">Returning Customers</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Method */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Shipping Method</Label>
              <Select
                value={filters.shippingMethod}
                onValueChange={(value) =>
                  handleFilterChange("shippingMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="standard">Standard Shipping</SelectItem>
                  <SelectItem value="express">Express Shipping</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="pickup">Store Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Payment Method</Label>
              <Select
                value={filters.paymentMethod}
                onValueChange={(value) =>
                  handleFilterChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                placeholder="City, State, or Country"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
