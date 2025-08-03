import React, { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Home, ArrowLeft, Search, Heart, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  // Cute Panda Component
  const CutePanda = () => {
    const [eyesBlink, setEyesBlink] = useState(false);
    const [isWaving, setIsWaving] = useState(false);

    useEffect(() => {
      const blinkInterval = setInterval(() => {
        setEyesBlink(true);
        setTimeout(() => setEyesBlink(false), 150);
      }, 3000);

      const waveInterval = setInterval(() => {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1000);
      }, 5000);

      return () => {
        clearInterval(blinkInterval);
        clearInterval(waveInterval);
      };
    }, []);

    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5,
        }}
        className="relative"
      >
        {/* Panda Body - Made smaller */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotate: [-0.5, 0.5, -0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Body - Reduced from w-32 h-40 to w-20 h-25 */}
          <div className="w-20 h-25 bg-gradient-to-b from-gray-100 to-white rounded-full relative shadow-xl">
            {/* Belly */}
            <div className="absolute inset-x-2.5 bottom-5 top-7 bg-gradient-to-b from-gray-50 to-gray-100 rounded-full" />

            {/* Head - Reduced from w-24 h-24 to w-15 h-15 */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-15 h-15 bg-gradient-to-b from-gray-100 to-white rounded-full shadow-lg">
              {/* Ears - Made smaller */}
              <div className="absolute -top-2 left-1.5 w-4 h-5 bg-gray-800 rounded-full" />
              <div className="absolute -top-2 right-1.5 w-4 h-5 bg-gray-800 rounded-full" />
              <div className="absolute -top-1.5 left-2 w-2.5 h-3.5 bg-pink-200 rounded-full" />
              <div className="absolute -top-1.5 right-2 w-2.5 h-3.5 bg-pink-200 rounded-full" />

              {/* Eyes - Made smaller */}
              <motion.div
                animate={eyesBlink ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
                className="absolute top-4 left-2.5 w-2 h-2 bg-gray-800 rounded-full"
              />
              <motion.div
                animate={eyesBlink ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
                className="absolute top-4 right-2.5 w-2 h-2 bg-gray-800 rounded-full"
              />

              {/* Eye shine */}
              <div className="absolute top-4 left-3 w-0.5 h-0.5 bg-white rounded-full" />
              <div className="absolute top-4 right-3 w-0.5 h-0.5 bg-white rounded-full" />

              {/* Nose */}
              <div className="absolute top-5.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1 bg-gray-800 rounded-full" />

              {/* Mouth */}
              <motion.div
                animate={{
                  scale: isHeartClicked ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-1/2 transform -translate-x-1/2"
              >
                <div className="w-3 h-1.5 border-b-2 border-gray-800 rounded-b-full" />
              </motion.div>

              {/* Blush */}
              <motion.div
                animate={{
                  opacity: isHeartClicked ? [0.3, 0.8, 0.3] : 0.3,
                  scale: isHeartClicked ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-5 left-0.5 w-2 h-1.5 bg-pink-300 rounded-full opacity-30"
              />
              <motion.div
                animate={{
                  opacity: isHeartClicked ? [0.3, 0.8, 0.3] : 0.3,
                  scale: isHeartClicked ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-5 right-0.5 w-2 h-1.5 bg-pink-300 rounded-full opacity-30"
              />
            </div>

            {/* Arms - Made smaller */}
            <motion.div
              animate={
                isWaving
                  ? {
                      rotate: [0, -20, 20, -10, 10, 0],
                      y: [0, -1, 0],
                    }
                  : { rotate: 0 }
              }
              transition={{ duration: 1 }}
              className="absolute top-2.5 -left-2.5 w-5 h-7 bg-gradient-to-b from-gray-100 to-white rounded-full shadow-md origin-top"
            />
            <div className="absolute top-2.5 -right-2.5 w-5 h-7 bg-gradient-to-b from-gray-100 to-white rounded-full shadow-md" />

            {/* Legs - Made smaller */}
            <div className="absolute bottom-1 left-2.5 w-4 h-5 bg-gradient-to-b from-gray-100 to-white rounded-full shadow-md" />
            <div className="absolute bottom-1 right-2.5 w-4 h-5 bg-gradient-to-b from-gray-100 to-white rounded-full shadow-md" />

            {/* Paws - Made smaller */}
            <div className="absolute -bottom-0.5 left-2.5 w-4 h-2.5 bg-gray-800 rounded-full" />
            <div className="absolute -bottom-0.5 right-2.5 w-4 h-2.5 bg-gray-800 rounded-full" />
          </div>
        </motion.div>

        {/* Floating hearts when clicked */}
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ scale: 0, x: heart.x, y: heart.y }}
              animate={{
                scale: [0, 1, 0],
                y: heart.y - 30,
                x: heart.x + (Math.random() - 0.5) * 25,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute pointer-events-none"
            >
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const handlePandaClick = () => {
    setIsHeartClicked(true);
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: 0,
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setIsHeartClicked(false);
      setFloatingHearts((prev) =>
        prev.filter((heart) => !newHearts.includes(heart))
      );
    }, 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
            className="absolute text-yellow-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Star className="w-4 h-4" />
          </motion.div>
        ))}

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
      >
        {/* 404 Text */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none select-none mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            404
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 1 }}
            className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto max-w-xs"
          />
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          variants={itemVariants}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl shadow-purple-500/10 p-8 md:p-12 rounded-3xl">
            <motion.div className="space-y-6">
              {/* Cute Panda Animation - Now inside the card */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-6 cursor-pointer"
                onClick={handlePandaClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CutePanda />
              </motion.div>

              {/* Title */}
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
              >
                Oops! Page Not Found
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              >
                The page you're looking for seems to have wandered off into the
                digital wilderness. Don't worry, our cute panda friend is here
                to help you find your way back!
              </motion.p>

              {/* Search Bar */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for what you're looking for..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </motion.form>

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="h-12 px-6 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 rounded-xl transition-all duration-300 group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </Button>
                <Button
                  asChild
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/">
                    <Home className="w-5 h-5 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </motion.div>

              {/* Fun Interactive Elements */}
              <motion.div
                variants={itemVariants}
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Click the panda for a surprise! 🐼
                </p>
                <div className="flex justify-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer"
                  >
                    <Heart className="w-6 h-6 text-pink-500" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer"
                  >
                    <Star className="w-6 h-6 text-purple-500" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Footer Message */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lost? Don't worry, even the best explorers take wrong turns
            sometimes.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
