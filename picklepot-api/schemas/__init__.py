# Schemas package - Import all schemas for API validation

# Common schemas
from .common import ErrorResponse, MessageResponse, Pagination, PaginationParams

# Authentication schemas
from .auth import *

# User schemas
from .user import *

# Product schemas
from .product import (
    Category, CategoryCreate, CategoryUpdate,
    Product, ProductCreate, ProductUpdate, ProductListItem,
    ProductImage, ProductImageCreate,
    ProductVariant, ProductVariantCreate, ProductVariantUpdate,
    ProductBadge, ProductBadgeCreate,
    ProductStatus, BadgeType
)

# Inventory schemas
from .inventory import (
    Inventory, InventoryCreate, InventoryUpdate,
    InventoryMovement, InventoryMovementCreate,
    StockAdjustmentRequest, LowStockAlert, InventorySummary,
    MovementType, ReferenceType
)

# Cart schemas
from .cart import (
    CartSession, CartSessionCreate,
    CartItem, CartItemCreate, CartItemUpdate,
    CartSummary, AddToCartRequest, UpdateCartItemRequest,
    CartMergeRequest, CartValidationResponse
)

# Order schemas
from .order import (
    Order, OrderCreate, OrderUpdate, OrderListItem,
    OrderItem, OrderItemCreate,
    OrderAddress, ShippingAddress,
    CheckoutRequest, CheckoutResponse,
    OrderStatusUpdate, OrderSearchFilters, OrderAnalytics,
    OrderStatus, PaymentStatus, FulfillmentStatus
)

# Payment schemas
from .payment import (
    PaymentTransaction, PaymentTransactionCreate, PaymentTransactionUpdate,
    Refund, RefundCreate, RefundUpdate,
    PaymentIntentCreate, PaymentIntentResponse,
    PaymentConfirmation, RefundRequest, PaymentAnalytics,
    UserPaymentMethod, UserPaymentMethodCreate,
    PaymentMethod, PaymentProcessor, TransactionStatus, RefundReason, RefundStatus
)

# Shipping schemas
from .shipping import (
    ShippingMethod, ShippingMethodCreate, ShippingMethodUpdate,
    Shipment, ShipmentCreate, ShipmentUpdate,
    ShippingCalculationRequest, ShippingRate,
    TrackingEvent, TrackingInfo, ShippingLabelRequest, ShippingAnalytics,
    ShipmentStatus
)

# Review schemas
from .review import (
    ProductReview, ProductReviewCreate, ProductReviewUpdate, ProductReviewListItem,
    ReviewStats, ReviewHelpfulRequest, ReviewReportRequest,
    ReviewModerationRequest, ReviewFilters, ProductReviewSummary
)

# Wishlist schemas
from .wishlist import (
    WishlistItem, WishlistItemCreate,
    WishlistResponse, AddToWishlistRequest, MoveToCartRequest
)

# Coupon schemas
from .coupon import (
    Coupon, CouponCreate, CouponUpdate,
    CouponUsage, CouponUsageCreate,
    CouponValidationRequest, CouponValidationResponse,
    CouponApplicationRequest, CouponApplicationResponse,
    CouponAnalytics, CouponPerformance,
    CouponType
)

# Analytics schemas
from .analytics import (
    AnalyticsEvent, AnalyticsEventCreate,
    NewsletterSubscription, NewsletterSubscriptionCreate, NewsletterSubscriptionUpdate,
    WebsiteAnalytics, ProductAnalytics, SalesAnalytics, CustomerAnalytics,
    TrackEventRequest, NewsletterSubscribeRequest, NewsletterUnsubscribeRequest,
    AnalyticsFilters, RealTimeAnalytics, AnalyticsSummary,
    EventType, SubscriptionStatus
)

# Content schemas
from .content import (
    Page, PageCreate, PageUpdate, PageListItem,
    BlogPost, BlogPostCreate, BlogPostUpdate, BlogPostListItem,
    Setting, SettingCreate, SettingUpdate, PublicSetting,
    ContentSearchRequest, ContentSearchResult, ContentSearchResponse,
    BlogFilters, ContentAnalytics, SEOData,
    BlogStatus, SettingType
)

__all__ = [
    # Common
    "ErrorResponse", "MessageResponse", "Pagination", "PaginationParams",
    
    # User & Auth (from existing modules)
    # Add auth and user exports here
    
    # Product
    "Category", "CategoryCreate", "CategoryUpdate",
    "Product", "ProductCreate", "ProductUpdate", "ProductListItem",
    "ProductImage", "ProductImageCreate",
    "ProductVariant", "ProductVariantCreate", "ProductVariantUpdate",
    "ProductBadge", "ProductBadgeCreate",
    "ProductStatus", "BadgeType",
    
    # Inventory
    "Inventory", "InventoryCreate", "InventoryUpdate",
    "InventoryMovement", "InventoryMovementCreate",
    "StockAdjustmentRequest", "LowStockAlert", "InventorySummary",
    "MovementType", "ReferenceType",
    
    # Cart
    "CartSession", "CartSessionCreate",
    "CartItem", "CartItemCreate", "CartItemUpdate",
    "CartSummary", "AddToCartRequest", "UpdateCartItemRequest",
    "CartMergeRequest", "CartValidationResponse",
    
    # Order
    "Order", "OrderCreate", "OrderUpdate", "OrderListItem",
    "OrderItem", "OrderItemCreate",
    "OrderAddress", "ShippingAddress",
    "CheckoutRequest", "CheckoutResponse",
    "OrderStatusUpdate", "OrderSearchFilters", "OrderAnalytics",
    "OrderStatus", "PaymentStatus", "FulfillmentStatus",
    
    # Payment
    "PaymentTransaction", "PaymentTransactionCreate", "PaymentTransactionUpdate",
    "Refund", "RefundCreate", "RefundUpdate",
    "PaymentIntentCreate", "PaymentIntentResponse",
    "PaymentConfirmation", "RefundRequest", "PaymentAnalytics",
    "UserPaymentMethod", "UserPaymentMethodCreate",
    "PaymentMethod", "PaymentProcessor", "TransactionStatus", "RefundReason", "RefundStatus",
    
    # Shipping
    "ShippingMethod", "ShippingMethodCreate", "ShippingMethodUpdate",
    "Shipment", "ShipmentCreate", "ShipmentUpdate",
    "ShippingCalculationRequest", "ShippingRate",
    "TrackingEvent", "TrackingInfo", "ShippingLabelRequest", "ShippingAnalytics",
    "ShipmentStatus",
    
    # Review
    "ProductReview", "ProductReviewCreate", "ProductReviewUpdate", "ProductReviewListItem",
    "ReviewStats", "ReviewHelpfulRequest", "ReviewReportRequest",
    "ReviewModerationRequest", "ReviewFilters", "ProductReviewSummary",
    
    # Wishlist
    "WishlistItem", "WishlistItemCreate",
    "WishlistResponse", "AddToWishlistRequest", "MoveToCartRequest",
    
    # Coupon
    "Coupon", "CouponCreate", "CouponUpdate",
    "CouponUsage", "CouponUsageCreate",
    "CouponValidationRequest", "CouponValidationResponse",
    "CouponApplicationRequest", "CouponApplicationResponse",
    "CouponAnalytics", "CouponPerformance",
    "CouponType",
    
    # Analytics
    "AnalyticsEvent", "AnalyticsEventCreate",
    "NewsletterSubscription", "NewsletterSubscriptionCreate", "NewsletterSubscriptionUpdate",
    "WebsiteAnalytics", "ProductAnalytics", "SalesAnalytics", "CustomerAnalytics",
    "TrackEventRequest", "NewsletterSubscribeRequest", "NewsletterUnsubscribeRequest",
    "AnalyticsFilters", "RealTimeAnalytics", "AnalyticsSummary",
    "EventType", "SubscriptionStatus",
    
    # Content
    "Page", "PageCreate", "PageUpdate", "PageListItem",
    "BlogPost", "BlogPostCreate", "BlogPostUpdate", "BlogPostListItem",
    "Setting", "SettingCreate", "SettingUpdate", "PublicSetting",
    "ContentSearchRequest", "ContentSearchResult", "ContentSearchResponse",
    "BlogFilters", "ContentAnalytics", "SEOData",
    "BlogStatus", "SettingType",
]
