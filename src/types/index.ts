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

export interface Product {
  average_rating: number;
  barcode: string;
  businessId: string;
  category: string;
  comparePrice: number | null;
  continueSellingWhenOutOfStock: boolean | null;
  costPrice: number;
  created: string; // ISO date string
  description: string;
  id: string;
  images: string[];
  isActive: boolean | null;
  isFeatured: boolean | null;
  metaDescription: string | null;
  metaTitle: string | null;
  name: string;
  price: number;
  rating_count: number;
  requiresShipping: boolean;
  sales_count: number;
  sku: string;
  slug: string | null;
  tags: string[];
  total_quantity_sold: number;
  trackQuantity: boolean | null;
  updated: string; // ISO date string
  view_count: number;
  weight: number;
  weightUnit: string | null;
  stock: number;
  status: "active" | "draft" | "archived";
  featured: boolean;
  compareAtPrice: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export type Stats = {
  [key in StatsKeys]: {
    change: string;
    value: string;
  };
};

export type StatsKeys =
  | "activeProducts"
  | "lowStockProducts"
  | "totalProducts"
  | "totalValue";

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  businessId: string;
};
