import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { UserType } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { getUserTypeRedirect } from "@/utils/auth";
import { LoadingCircle } from "@/components/icons";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedUserTypes = [],
  requireAuth = true,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  console.log(user, isAuthenticated, allowedUserTypes);
  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingCircle />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user types are specified and user doesn't have the required type
  if (
    allowedUserTypes.length > 0 &&
    user &&
    !allowedUserTypes.includes(user.userType)
  ) {
    // Redirect based on user type
    const redirectPath = getUserTypeRedirect(user.userType);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
