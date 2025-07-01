/**
 * TypeScript interfaces for The Pickle Pot API
 * Generated from OpenAPI specification
 */

// Common types
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

export interface MessageResponse {
  message: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  message: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  preferredContactMethod?: "email" | "phone" | "sms";
  preferredContactTime?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  id: string;
  type: "credit" | "debit";
  isDefault: boolean;
  cardNumber: string; // masked
  expiryMonth: string;
  expiryYear: string;
  cardHolderName: string;
  brand: "visa" | "mastercard" | "amex" | "discover";
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  variants: ProductVariant[];
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  tags: string[];
  nutritionalInfo?: NutritionalInfo;
  ingredients: string[];
  allergens: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  weight: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
  servingSize: string;
}

// Cart types
export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  appliedCoupons: AppliedCoupon[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  appliedAmount: number;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  appliedCoupons: AppliedCoupon[];
  orderDate: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Coupon types
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

// API Response wrappers
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductsResponse extends PaginatedResponse<Product> {}
export interface OrdersResponse extends PaginatedResponse<Order> {}
export interface ReviewsResponse extends PaginatedResponse<Review> {}
