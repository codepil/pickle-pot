# Models package - Import all models to ensure they are registered with SQLAlchemy

from .user import User, Address, PaymentMethod
from .product import Category, Product, ProductImage, ProductVariant, ProductBadge
from .inventory import Inventory, InventoryMovement
from .cart import CartSession, CartItem
from .order import Order, OrderItem
from .payment import PaymentTransaction, Refund
from .shipping import ShippingMethod, Shipment
from .review import ProductReview
from .wishlist import WishlistItem
from .coupon import Coupon, CouponUsage
from .analytics import AnalyticsEvent, NewsletterSubscription
from .content import Page, BlogPost, Setting

__all__ = [
    # User models
    "User", "Address", "PaymentMethod",
    
    # Product models
    "Category", "Product", "ProductImage", "ProductVariant", "ProductBadge",
    
    # Inventory models
    "Inventory", "InventoryMovement",
    
    # Cart models
    "CartSession", "CartItem",
    
    # Order models
    "Order", "OrderItem",
    
    # Payment models
    "PaymentTransaction", "Refund",
    
    # Shipping models
    "ShippingMethod", "Shipment",
    
    # Review models
    "ProductReview",
    
    # Wishlist models
    "WishlistItem",
    
    # Coupon models
    "Coupon", "CouponUsage",
    
    # Analytics models
    "AnalyticsEvent", "NewsletterSubscription",
    
    # Content models
    "Page", "BlogPost", "Setting",
]
