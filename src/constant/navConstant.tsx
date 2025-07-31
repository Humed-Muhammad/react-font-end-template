import {
  BarChart3,
  CreditCard,
  Package,
  ShoppingCart,
  Truck,
  Bell,
  Utensils,
  Smartphone,
  Store,
  Coffee,
} from "lucide-react";

export const features = [
  {
    title: "Order Management",
    description: "Streamline order processing with automation",
    icon: <ShoppingCart className="h-8 w-6 text-white" />,
    href: "/features/order-management",
    color: "from-blue-500 to-cyan-500",
    badge: "Popular",
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time insights and reporting",
    icon: <BarChart3 className="h-8 w-6 text-white" />,
    href: "/features/analytics",
    color: "from-purple-500 to-pink-500",
    badge: "New",
  },
  {
    title: "Inventory Tracking",
    description: "Smart inventory management system",
    icon: <Package className="h-8 w-6 text-white" />,
    href: "/features/inventory",
    color: "from-green-500 to-emerald-500",
    badge: null,
  },
  {
    title: "Delivery Management",
    description: "Coordinate deliveries and logistics",
    icon: <Truck className="h-8 w-6 text-white" />,
    href: "/features/delivery",
    color: "from-orange-500 to-red-500",
    badge: null,
  },
  {
    title: "Payment Processing",
    description: "Secure payment gateway integration",
    icon: <CreditCard className="h-8 w-6 text-white" />,
    href: "/features/payments",
    color: "from-indigo-500 to-purple-500",
    badge: null,
  },
  {
    title: "Notifications",
    description: "Smart alerts and communication",
    icon: <Bell className="h-8 w-8 text-white" />,
    href: "/features/notifications",
    color: "from-yellow-500 to-orange-500",
    badge: "Beta",
  },
];

export const solutions = [
  {
    title: "Restaurants",
    description: "Complete restaurant order management",
    icon: <Utensils className="h-5 w-5" />,
    href: "/solutions/restaurants",
  },
  {
    title: "Retail Stores",
    description: "Streamline retail operations",
    icon: <Store className="h-5 w-5" />,
    href: "/solutions/retail",
  },
  {
    title: "Cafes & Coffee Shops",
    description: "Perfect for coffee businesses",
    icon: <Coffee className="h-5 w-5" />,
    href: "/solutions/cafes",
  },
  {
    title: "E-commerce",
    description: "Online store management",
    icon: <Smartphone className="h-5 w-5" />,
    href: "/solutions/ecommerce",
  },
];

export const resources = [
  {
    title: "Getting Started",
    description: "Learn how to set up OrderMe",
    href: "/docs/getting-started",
  },
  {
    title: "API Documentation",
    description: "Integrate with our powerful API",
    href: "/docs/api",
  },
  {
    title: "Help Center",
    description: "Find answers to common questions",
    href: "/help",
  },
  {
    title: "Community",
    description: "Connect with other business owners",
    href: "/community",
  },
];
