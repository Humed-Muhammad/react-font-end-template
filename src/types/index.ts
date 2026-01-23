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
  category: {
    id: string;
    name: string;
  };
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
  inventory: string;
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

export interface Order {
  id: string;
  customer: Partial<{
    id: string;
    avatar: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    isVip: boolean;
  }>;
  paymentMethod: string;
  deliveryFee: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivering"
    | "delivered"
    | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded" | "partially_paid";
  totalAmount: number;
  shippingCost: number;
  discountAmount: number;
  currency: string;
  shippingAddress: Record<string, string | number>; // or a more detailed Address type
  billingAddress: Record<string, string | number>; // or a more detailed Address type
  notes?: string;
  items: OrderItem[];
  created: string;
  updated: string;
  estimatedDelivery: string;
  customerNotes: string;
  deliveryAddress?: Record<string, string | number>; // or a more detailed Address type
}

export interface OrderItem {
  order: string; // RELATION_RECORD_ID
  product: string; // RELATION_RECORD_ID
  variant: string; // RELATION_RECORD_ID
  name: string;
  sku: string;
  quantity: number;
  price: number;
  totalPrice: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snapshot: Record<string, any>; // or a stricter type if you know the shape
  image: string; // URL
  discount?: number;
}
