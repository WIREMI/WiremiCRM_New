// Product Management Types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: ProductCategory;
  subcategory?: string;
  type: ProductType;
  status: ProductStatus;
  pricing: ProductPricing;
  inventory: ProductInventory;
  specifications: ProductSpecification[];
  images: string[];
  tags: string[];
  supplier?: ProductSupplier;
  lifecycle: ProductLifecycle;
  analytics: ProductAnalytics;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  isActive: boolean;
}

export interface ProductPricing {
  basePrice: number;
  currency: string;
  discounts: ProductDiscount[];
  tierPricing: TierPricing[];
  costPrice?: number;
  margin?: number;
}

export interface ProductDiscount {
  id: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate?: string;
  conditions?: any;
  isActive: boolean;
}

export interface TierPricing {
  tier: CustomerTier;
  price: number;
  discount?: number;
}

export interface ProductInventory {
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  reorderLevel: number;
  maxStock?: number;
  locations: InventoryLocation[];
  lastRestocked?: string;
}

export interface InventoryLocation {
  locationId: string;
  locationName: string;
  stock: number;
  reserved: number;
}

export interface ProductSpecification {
  name: string;
  value: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE';
  isRequired: boolean;
}

export interface ProductSupplier {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  leadTime: number; // days
  minimumOrder?: number;
}

export interface ProductLifecycle {
  stage: ProductLifecycleStage;
  launchDate?: string;
  discontinueDate?: string;
  version: string;
  changeLog: ProductChange[];
}

export interface ProductChange {
  version: string;
  changes: string[];
  date: string;
  changedBy: string;
}

export interface ProductAnalytics {
  views: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod: string;
  fulfillment: OrderFulfillment;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: any;
}

export interface OrderFulfillment {
  status: FulfillmentStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Enums
export enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  SERVICE = 'SERVICE',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  DISCONTINUED = 'DISCONTINUED'
}

export enum ProductLifecycleStage {
  DEVELOPMENT = 'DEVELOPMENT',
  LAUNCH = 'LAUNCH',
  GROWTH = 'GROWTH',
  MATURITY = 'MATURITY',
  DECLINE = 'DECLINE',
  DISCONTINUED = 'DISCONTINUED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum FulfillmentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}