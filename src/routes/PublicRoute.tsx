import React from "react";
import { Navigate } from "react-router-dom";
import { getUserTypeRedirect } from "@/utils/auth";
import { useAuthSlice } from "@/pages/Auth/slice";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectIfAuthenticated = true,
}) => {
  const { user, isFetchingUser } = useAuthSlice();
  // if (redirectIfAuthenticated && !isFetchingUser && user) {
  //   const redirectPath = getUserTypeRedirect(user.userType);
  //   return <Navigate to={redirectPath} replace />;
  // }

  return <>{children}</>;
};
