from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class EventType(str, Enum):
    page_view = "page_view"
    product_view = "product_view"
    add_to_cart = "add_to_cart"
    remove_from_cart = "remove_from_cart"
    search = "search"
    purchase = "purchase"

class SubscriptionStatus(str, Enum):
    subscribed = "subscribed"
    unsubscribed = "unsubscribed"
    pending = "pending"

# Analytics Event schemas
class AnalyticsEventBase(BaseModel):
    session_id: str = Field(..., max_length=255)
    event_type: EventType
    page_url: Optional[str] = Field(None, max_length=500)
    referrer_url: Optional[str] = Field(None, max_length=500)
    product_id: Optional[str] = None
    search_term: Optional[str] = Field(None, max_length=255)
    user_agent: Optional[str] = None
    ip_address: Optional[str] = Field(None, max_length=45)
    country: Optional[str] = Field(None, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)

class AnalyticsEventCreate(AnalyticsEventBase):
    user_id: Optional[str] = None

class AnalyticsEvent(AnalyticsEventBase):
    id: str
    user_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Newsletter Subscription schemas
class NewsletterSubscriptionBase(BaseModel):
    email: EmailStr
    subscription_source: Optional[str] = Field(None, max_length=100)

class NewsletterSubscriptionCreate(NewsletterSubscriptionBase):
    user_id: Optional[str] = None

class NewsletterSubscriptionUpdate(BaseModel):
    status: Optional[SubscriptionStatus] = None
    confirmed_at: Optional[datetime] = None
    unsubscribed_at: Optional[datetime] = None

class NewsletterSubscription(NewsletterSubscriptionBase):
    id: str
    user_id: Optional[str] = None
    status: SubscriptionStatus
    confirmed_at: Optional[datetime] = None
    unsubscribed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics dashboard schemas
class WebsiteAnalytics(BaseModel):
    total_page_views: int
    unique_visitors: int
    bounce_rate: float
    average_session_duration: float
    top_pages: list[dict]
    traffic_sources: dict[str, int]
    device_breakdown: dict[str, int]
    geographic_breakdown: dict[str, int]

    class Config:
        from_attributes = True

class ProductAnalytics(BaseModel):
    total_product_views: int
    most_viewed_products: list[dict]
    cart_additions: int
    cart_removals: int
    conversion_rate: float
    search_terms: list[dict]

    class Config:
        from_attributes = True

class SalesAnalytics(BaseModel):
    total_revenue: float
    total_orders: int
    average_order_value: float
    conversion_rate: float
    revenue_by_day: dict[str, float]
    orders_by_day: dict[str, int]
    top_selling_products: list[dict]
    customer_segments: dict[str, int]

    class Config:
        from_attributes = True

class CustomerAnalytics(BaseModel):
    total_customers: int
    new_customers: int
    returning_customers: int
    customer_lifetime_value: float
    customer_acquisition_cost: float
    customer_retention_rate: float
    newsletter_subscribers: int
    subscription_growth_rate: float

    class Config:
        from_attributes = True

# Event tracking request
class TrackEventRequest(BaseModel):
    event_type: EventType
    session_id: str
    user_id: Optional[str] = None
    page_url: Optional[str] = None
    referrer_url: Optional[str] = None
    product_id: Optional[str] = None
    search_term: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

# Newsletter subscription request
class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr
    source: str = "website"
    user_id: Optional[str] = None

# Newsletter unsubscribe request
class NewsletterUnsubscribeRequest(BaseModel):
    email: EmailStr
    token: Optional[str] = None

# Analytics filters
class AnalyticsFilters(BaseModel):
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    event_type: Optional[EventType] = None
    user_id: Optional[str] = None
    product_id: Optional[str] = None
    country: Optional[str] = None

# Real-time analytics
class RealTimeAnalytics(BaseModel):
    active_users: int
    current_page_views: int
    recent_events: list[AnalyticsEvent]
    trending_products: list[dict]
    live_orders: int

    class Config:
        from_attributes = True

# Analytics summary
class AnalyticsSummary(BaseModel):
    website: WebsiteAnalytics
    products: ProductAnalytics
    sales: SalesAnalytics
    customers: CustomerAnalytics
    period_start: datetime
    period_end: datetime

    class Config:
        from_attributes = True
