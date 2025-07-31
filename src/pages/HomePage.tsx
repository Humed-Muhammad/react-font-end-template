import { motion, useScroll, useTransform } from "framer-motion";
import {
  Play,
  Zap,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Video,
  Rocket,
  TrendingUp,
  Award,
  ChevronDown,
  ShoppingCart,
  Package,
  BarChart3,
  Clock,
  Smartphone,
  CreditCard,
  Bell,
  FileText,
  Truck,
  Building2,
  Phone,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { BusinessTypes } from "@/components/homeSections/BusinessTypes";

export const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Smart Order Management",
      description:
        "Streamline your order processing with intelligent automation and real-time tracking",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description:
        "Get deep insights into your business performance with comprehensive reporting",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile-First Design",
      description:
        "Manage your business on-the-go with our responsive mobile interface",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description:
        "Process orders 10x faster with automated workflows and instant notifications",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Orders Processed Daily",
      icon: <Package className="h-6 w-6" />,
    },
    {
      number: "2K+",
      label: "Active Businesses",
      icon: <Building2 className="h-6 w-6" />,
    },
    {
      number: "99.9%",
      label: "Uptime Guarantee",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      number: "4.8/5",
      label: "Customer Rating",
      icon: <Star className="h-6 w-6" />,
    },
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      role: "Restaurant Owner",
      company: "Bella Vista Bistro",
      content:
        "OrderMe transformed our restaurant operations. We've reduced order processing time by 70% and increased customer satisfaction significantly.",
      avatar: "MR",
      rating: 5,
    },
    {
      name: "James Chen",
      role: "E-commerce Manager",
      company: "TechGear Store",
      content:
        "The analytics dashboard gives us incredible insights. We've optimized our inventory and increased sales by 45% in just 3 months.",
      avatar: "JC",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Cafe Chain Owner",
      company: "Morning Brew",
      content:
        "Managing multiple locations is now effortless. Real-time order tracking across all our cafes has been a game-changer.",
      avatar: "SJ",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 500 orders/month",
        "Basic analytics dashboard",
        "Email notifications",
        "Mobile app access",
        "Standard support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 5,000 orders/month",
        "Advanced analytics & reports",
        "SMS & push notifications",
        "Multi-location support",
        "Priority support",
        "Custom integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited orders",
        "White-label solution",
        "Dedicated account manager",
        "API access",
        "Custom workflows",
        "24/7 phone support",
      ],
      popular: false,
    },
  ];

  const keyFeatures = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Real-time Order Tracking",
      description: "Track every order from placement to delivery in real-time",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Smart Notifications",
      description: "Automated alerts for new orders, updates, and issues",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Payment Processing",
      description: "Secure payment gateway with multiple payment options",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Invoice Management",
      description: "Automated invoice generation and payment tracking",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Delivery Management",
      description: "Coordinate deliveries with integrated logistics partners",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Customer Management",
      description: "Comprehensive customer profiles and order history",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Order Management SaaS
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent leading-tight">
              Streamline Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Order Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The all-in-one platform that helps businesses of all sizes manage
              orders, track inventory, and delight customers with seamless
              experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-semibold transition-all duration-300"
            >
              <Video className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-slate-400" />
        </motion.div>
      </section>

      <BusinessTypes />

      {/* Features Section */}
      <section className="py-24 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Manage Orders
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From order processing to customer management, we've got you
              covered with enterprise-grade features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              <Award className="h-4 w-4 mr-2" />
              Advanced Capabilities
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Advanced Features for
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Modern Businesses
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-6 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Users className="h-4 w-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by Businesses
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              See how OrderMe has transformed businesses across different
              industries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
              <CreditCard className="h-4 w-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`relative ${plan.popular ? "scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full ${
                    plan.popular
                      ? "border-purple-500 border-2 shadow-2xl"
                      : "border-slate-200 dark:border-slate-700"
                  } bg-white dark:bg-slate-800`}
                >
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 ml-1">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full h-12 ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                      } font-semibold rounded-xl transition-all duration-300`}
                    >
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Start Free Trial"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform
              <br />
              Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using OrderMe to streamline
              their operations and delight their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-8 bg-white text-black hover:bg-blue-50 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Your Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 border-white text-black hover:bg-white hover:text-blue-600 rounded-xl font-semibold transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
