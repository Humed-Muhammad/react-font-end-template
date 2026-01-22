import { motion } from "framer-motion";
import { Bell, Package, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { db } from "@/utils/pockatbase";

const menus = [
  { label: "Overview", link: "/dashboard" },
  {
    label: "orders",
    link: "/orders",
  },
  {
    label: "products",
    link: "/products",
  },
  {
    label: "analytics",
    link: "/analytics",
  },
];

export const AdminDashboard = () => {
  const location = useLocation();

  const isActiveLink = (menuLink: string) => {
    // Exact match for overview, partial match for others
    if (menuLink === "/dashboard") {
      return (
        location.pathname === menuLink || location.pathname === "/dashboard"
      );
    }
    return location.pathname.startsWith(menuLink);
  };

  return (
    <div className="flex items-center space-x-8">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
          OrderMe
        </span>
      </motion.div>

      <nav className="hidden md:flex space-x-6">
        {menus.map((menu) => (
          <Link
            to={menu.link}
            key={menu.label}
            className={`cursor-pointer px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActiveLink(menu.link)
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            {menu.label.charAt(0).toUpperCase() + menu.label.slice(1)}
          </Link>
        ))}
      </nav>
    </div>
  );
};

type Props = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};
export const AdminDashboardNav = ({ searchQuery, setSearchQuery }: Props) => {
  const navigate = useNavigate();
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <AdminDashboard />

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
              // onClick={notificationController.onOpen}
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
                    <AvatarFallback>
                      {db.authStore.record?.name.split("")[0].toUpperCase()}
                    </AvatarFallback>
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
  );
};
