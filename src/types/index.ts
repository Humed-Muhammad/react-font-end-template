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
