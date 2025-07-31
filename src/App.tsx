import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/utils/firebase";

import { SignupPage } from "./pages/SignupPage";
import LegalPage from "./pages/LegalPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/Login";
import { LoadingCircle } from "./components/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { OrderTracking } from "./pages/OrderTracking";
const App: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <LoadingCircle />
      </div>
    );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={!user ? <HomePage /> : <Navigate to="/signup" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route
            path="/order-tracking"
            element={<OrderTracking orderId="1" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
