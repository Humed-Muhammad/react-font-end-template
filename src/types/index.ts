export interface OrderStatus {
  id: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  timestamp?: Date;
  estimatedTime?: string;
}

export interface Order {
  id: string;
  customerId: string;
  businessId: string;
  items: OrderItem[];
  totalAmount: number;
  currentStatus: string;
  statusHistory: OrderStatus[];
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  customerNotes?: string;
  adminNotes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  avatar?: string;
  permissions?: string[];
  businessId?: string;
}

export type UserType =
  | "service_owner"
  | "product_owner"
  | "customer"
  | "inventory_manager"
  | "cashier"
  | "delivery_person"
  | "admin";

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}
