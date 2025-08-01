import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getUserTypeRedirect } from "@/utils/auth";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectIfAuthenticated = true,
}) => {
  const { user, isAuthenticated } = useAuth();
  console.log(user, isAuthenticated, redirectIfAuthenticated);
  if (redirectIfAuthenticated && isAuthenticated && user) {
    const redirectPath = getUserTypeRedirect(user.userType);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
