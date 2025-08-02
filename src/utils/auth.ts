import type { UserType } from "@/types";

export const getUserTypeRedirect = (userType: string): string => {
  switch (userType) {
    case "customer":
      return "/customer/orders";
    case "inventory_manager":
      return "/inventory/dashboard";
    case "cashier":
      return "/pos/dashboard";
    case "delivery_person":
      return "/delivery/dashboard";
    case "service_owner":
    case "product_owner":
      return "/product_owner/dashboard";
    case "admin":
      return "/dashboard";
    default:
      return "/unauthorized";
  }
};

export const hasPermission = (
  userType: UserType,
  requiredPermissions: string[]
): boolean => {
  const userPermissions = getUserPermissions(userType);
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
};

export const getUserPermissions = (userType: UserType): string[] => {
  switch (userType) {
    case "service_owner":
      return ["read:all", "write:all", "delete:all", "manage:business"];
    case "product_owner":
      return ["read:all", "write:products", "write:orders", "manage:inventory"];
    case "inventory_manager":
      return ["read:inventory", "write:inventory", "read:products"];
    case "cashier":
      return [
        "read:orders",
        "write:orders",
        "read:customers",
        "process:payments",
      ];
    case "delivery_person":
      return ["read:orders", "update:delivery_status"];
    case "customer":
      return ["read:own_orders", "write:own_profile"];
    case "admin":
      return [
        "read:all",
        "write:all",
        "delete:all",
        "manage:users",
        "manage:system",
      ];
    default:
      return [];
  }
};
