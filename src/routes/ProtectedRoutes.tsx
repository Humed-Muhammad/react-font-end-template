import React from "react";
import { Navigate } from "react-router-dom";
import type { UserType } from "@/types";
import { getUserTypeRedirect } from "@/utils/auth";
import { LoadingCircle } from "@/components/icons";
import { useAuthSlice } from "@/pages/Auth/slice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedUserTypes = [],
}) => {
  const { user, isFetchingUser } = useAuthSlice();
  if (isFetchingUser && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingCircle />
      </div>
    );
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
