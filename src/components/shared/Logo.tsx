import { motion } from "framer-motion";
import { Package } from "lucide-react";
export const Logo = () => {
  return (
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
  );
};
