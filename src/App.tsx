import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

// Auth components
import { useAuth } from "./hooks/useAuth";

// Public pages
import { SignupPage } from "./pages/SignupPage";
import LegalPage from "./pages/LegalPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/Login";
import { OrderTracking } from "./pages/OrderTracking";
import { Unauthorized } from "./pages/Unauthorized";

// Protected pages
import Dashboard from "./pages/Dashboard";
// import { CustomerOrders } from "./pages/customer/CustomerOrders";
// import { InventoryDashboard } from "./pages/inventory/InventoryDashboard";
// import { POSDashboard } from "./pages/pos/POSDashboard";
// import { DeliveryDashboard } from "./pages/delivery/DeliveryDashboard";

// Components
import { LoadingCircle } from "./components/icons";
import { PublicRoute } from "./routes/PublicRoute";
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import { getUserTypeRedirect } from "./utils/auth";

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  if (loading) {
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
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Public Order Tracking - accessible to all */}
        <Route
          path="/order-tracking/:orderId?"
          element={<OrderTracking orderId="1" />}
        />

        {/* Owner/Admin Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedUserTypes={["service_owner", "product_owner", "admin"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute allowedUserTypes={["customer"]}>
              <div>CustomerOrders</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute allowedUserTypes={["customer"]}>
              <div>Customer Profile Page</div>
            </ProtectedRoute>
          }
        />

        {/* Inventory Manager Routes */}
        <Route
          path="/inventory/dashboard"
          element={
            <ProtectedRoute
              allowedUserTypes={[
                "inventory_manager",
                "service_owner",
                "product_owner",
              ]}
            >
              <div>InventoryDashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/products"
          element={
            <ProtectedRoute
              allowedUserTypes={[
                "inventory_manager",
                "service_owner",
                "product_owner",
              ]}
            >
              <div>Products Management Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/stock"
          element={
            <ProtectedRoute
              allowedUserTypes={[
                "inventory_manager",
                "service_owner",
                "product_owner",
              ]}
            >
              <div>Stock Management Page</div>
            </ProtectedRoute>
          }
        />

        {/* Cashier/POS Routes */}
        <Route
          path="/pos/dashboard"
          element={
            <ProtectedRoute
              allowedUserTypes={["cashier", "service_owner", "product_owner"]}
            >
              <div>POSDashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos/orders"
          element={
            <ProtectedRoute
              allowedUserTypes={["cashier", "service_owner", "product_owner"]}
            >
              <div>POS Orders Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos/payments"
          element={
            <ProtectedRoute
              allowedUserTypes={["cashier", "service_owner", "product_owner"]}
            >
              <div>Payments Processing Page</div>
            </ProtectedRoute>
          }
        />

        {/* Delivery Person Routes */}
        <Route
          path="/delivery/dashboard"
          element={
            <ProtectedRoute
              allowedUserTypes={[
                "delivery_person",
                "service_owner",
                "product_owner",
              ]}
            >
              <div>DeliveryDashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/routes"
          element={
            <ProtectedRoute
              allowedUserTypes={[
                "delivery_person",
                "service_owner",
                "product_owner",
              ]}
            >
              <div>Delivery Routes Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/history"
          element={
            <ProtectedRoute
              allowedUserTypes={[
                "delivery_person",
                "service_owner",
                "product_owner",
              ]}
            >
              <div>Delivery History Page</div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedUserTypes={["admin"]}>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedUserTypes={["admin", "service_owner"]}>
              <div>User Management Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedUserTypes={["admin", "service_owner"]}>
              <div>System Settings Page</div>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to={getUserTypeRedirect(user.userType)} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
