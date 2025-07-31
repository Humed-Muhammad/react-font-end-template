import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import {
  ArrowRight,
  Cake,
  Coffee,
  Globe,
  Heart,
  Phone,
  Shirt,
  Store,
  Utensils,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const businessTypes = [
  {
    icon: <Cake className="h-6 w-6" />,
    name: "Cake",
    description: "Baked goods & cakes",
    color: "from-pink-500 to-pink-200",
  },
  {
    icon: <Utensils className="h-6 w-6" />,
    name: "Restaurants",
    description: "Food delivery & dine-in orders",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: <Store className="h-6 w-6" />,
    name: "Retail",
    description: "E-commerce & in-store sales",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Coffee className="h-6 w-6" />,
    name: "Cafes",
    description: "Quick service & takeaway",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: <Shirt className="h-6 w-6" />,
    name: "Fashion",
    description: "Clothing & accessories",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    name: "Services",
    description: "Booking & appointment management",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    name: "Healthcare",
    description: "Patient appointments & orders",
    color: "from-rose-500 to-red-500",
  },
];
export const BusinessTypes = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 dark:from-emerald-900/10 dark:via-green-900/5 dark:to-teal-900/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-green-500/25 transition-all duration-300">
              <Globe className="h-5 w-5 mr-2" />
              For Every Business
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8 text-slate-900 dark:text-white"
          >
            Built for
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Every Industry
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Whether you're running a restaurant, retail store, or service
            business, OrderMe adapts to your unique needs with industry-specific
            features.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {businessTypes.map((business, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 10,
              }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 dark:from-slate-700/20 dark:to-slate-700/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <Card className="relative h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <CardContent className="relative p-8">
                  {/* Icon container with enhanced styling */}
                  <div className="flex items-start mb-6">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-4 rounded-2xl bg-gradient-to-br ${business.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      {/* Icon glow effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${business.color} rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                      />
                      <div className="relative z-10">{business.icon}</div>
                    </motion.div>

                    <div className="ml-6 flex-1">
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {business.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {business.description}
                      </p>
                    </div>
                  </div>

                  {/* Feature highlights */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors duration-300" />
                      Real-time order tracking
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300" />
                      Custom workflow automation
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3 group-hover:bg-teal-400 transition-colors duration-300" />
                      Industry-specific analytics
                    </div>
                  </div>

                  {/* Hover reveal button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 20 }}
                    // whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </motion.div>
                </CardContent>

                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Don't see your industry? We customize solutions for any business
            type.
          </p>
          <Button
            variant="outline"
            className="px-8 py-3 border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Phone className="h-5 w-5 mr-2" />
            Discuss Custom Solution
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
