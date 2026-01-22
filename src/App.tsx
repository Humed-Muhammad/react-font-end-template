import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

// Components
import { PublicRoute } from "./routes/PublicRoute";
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import { NotFoundPage } from "./pages/Notfound";
import { CreateProductPage } from "./pages/AdminPages/Products/CreateProducts";
import { ProductListPage } from "./pages/AdminPages/Products/Products";
import { BarcodePage } from "./pages/BarcodePage";
import { QRCodePage } from "./pages/QRCodePage";
import { Orders } from "./pages/AdminPages/Orders/Orders";
import { LoadingComponent } from "./components/shared/LoadingComponent";
import { CreateOrder } from "./pages/AdminPages/Orders/CreateOrder";
import { Toaster } from "./components/ui/sonner";

const App: React.FC = () => {
  const { user, isFetchingUser } = useAuth();

  if (isFetchingUser && !user) {
    <LoadingComponent />;
  }

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
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
        <Route
          path="/barcode"
          element={
            <PublicRoute>
              <BarcodePage />
            </PublicRoute>
          }
        />
        <Route path="/qrcode" element={<QRCodePage />} />
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

        <Route
          path="/orders"
          element={
            <ProtectedRoute
              allowedUserTypes={["service_owner", "product_owner", "admin"]}
            >
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/new"
          element={
            <ProtectedRoute
              allowedUserTypes={["service_owner", "product_owner", "admin"]}
            >
              <CreateOrder />
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
          path="/products/new"
          element={
            <ProtectedRoute
              allowedUserTypes={["admin", "service_owner", "inventory_manager"]}
            >
              <CreateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:productId/edit"
          element={
            <ProtectedRoute
              allowedUserTypes={["admin", "service_owner", "inventory_manager"]}
            >
              <CreateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute
              allowedUserTypes={["admin", "service_owner", "inventory_manager"]}
            >
              <ProductListPage />
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

        <Route element={<NotFoundPage />} path="*" />

        {/* Catch-all route */}
        {/* <Route
          path="*"
          element={
            user ? (
              <Navigate to={getUserTypeRedirect(user.userType)} replace />
            ) : (
              <Navigate to="/notfound" replace />
            )
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
