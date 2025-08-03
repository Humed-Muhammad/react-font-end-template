import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menus = [
  { label: "Overview", link: "/dashboard/overview" },
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

export const AdminDashboardNav = () => {
  const location = useLocation();

  const isActiveLink = (menuLink: string) => {
    // Exact match for overview, partial match for others
    if (menuLink === "/dashboard/overview") {
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
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
