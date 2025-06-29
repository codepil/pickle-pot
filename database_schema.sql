-- ================================================================
-- THE PICKLE POT E-COMMERCE DATABASE SCHEMA
-- ================================================================
-- This schema supports a comprehensive e-commerce platform for 
-- traditional pickles and spice powders with full order management,
-- user accounts, inventory tracking, and customer engagement features.
-- ================================================================

-- Enable UUID extension for PostgreSQL (comment out for MySQL/other DBs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- USERS AND AUTHENTICATION
-- ================================================================

-- Users table for customer accounts
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(320) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_status (status),
    INDEX idx_users_created_at (created_at)
);

-- User profiles for personal information
CREATE TABLE user_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    preferred_contact_method ENUM('email', 'phone', 'sms') DEFAULT 'email',
    preferred_contact_time ENUM('morning', 'afternoon', 'evening', 'anytime') DEFAULT 'anytime',
    marketing_emails_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_profiles_user_id (user_id),
    INDEX idx_user_profiles_name (first_name, last_name)
);

-- User addresses for delivery
CREATE TABLE user_addresses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('home', 'work', 'other') DEFAULT 'home',
    is_default BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'United States',
    phone VARCHAR(20),
    delivery_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_addresses_user_id (user_id),
    INDEX idx_user_addresses_default (user_id, is_default)
);

-- User payment methods
CREATE TABLE user_payment_methods (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('credit', 'debit') DEFAULT 'credit',
    is_default BOOLEAN DEFAULT FALSE,
    card_last_four CHAR(4) NOT NULL,
    expiry_month CHAR(2) NOT NULL,
    expiry_year CHAR(4) NOT NULL,
    card_holder_name VARCHAR(255) NOT NULL,
    brand ENUM('visa', 'mastercard', 'amex', 'discover') NOT NULL,
    payment_processor_token VARCHAR(255), -- For Stripe, PayPal, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payment_methods_user_id (user_id),
    INDEX idx_payment_methods_default (user_id, is_default)
);

-- ================================================================
-- PRODUCT CATALOG
-- ================================================================

-- Product categories
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id VARCHAR(36),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent (parent_id),
    INDEX idx_categories_active (is_active),
    INDEX idx_categories_order (display_order)
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES 
('Pickles', 'pickles', 'Traditional and authentic pickle varieties'),
('Spice Powders', 'powders', 'Premium ground spices and masala blends'),
('Curry Powders', 'curry-powders', 'Authentic curry powder blends'),
('Seasonal Specials', 'seasonal', 'Limited time seasonal offerings');

-- Products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id VARCHAR(36) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    weight_6oz DECIMAL(8,2),
    weight_8oz DECIMAL(8,2),
    price_6oz DECIMAL(10,2),
    price_8oz DECIMAL(10,2),
    compare_price_6oz DECIMAL(10,2), -- Original price for discount display
    compare_price_8oz DECIMAL(10,2),
    cost_price_6oz DECIMAL(10,2), -- For profit calculation
    cost_price_8oz DECIMAL(10,2),
    tax_category VARCHAR(50) DEFAULT 'standard',
    requires_shipping BOOLEAN DEFAULT TRUE,
    shipping_weight_6oz DECIMAL(8,2),
    shipping_weight_8oz DECIMAL(8,2),
    ingredients TEXT,
    allergen_info TEXT,
    nutritional_info JSON,
    storage_instructions TEXT,
    shelf_life_days INT,
    origin_country VARCHAR(100),
    manufacturer VARCHAR(255),
    tags JSON, -- For search and filtering
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_products_slug (slug),
    INDEX idx_products_sku (sku),
    INDEX idx_products_category (category_id),
    INDEX idx_products_status (status),
    INDEX idx_products_featured (featured),
    INDEX idx_products_name (name),
    FULLTEXT idx_products_search (name, description, tags)
);

-- Product images
CREATE TABLE product_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_images_product (product_id),
    INDEX idx_product_images_primary (product_id, is_primary),
    INDEX idx_product_images_order (product_id, display_order)
);

-- Product variants (for different sizes, flavors, etc.)
CREATE TABLE product_variants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g., "6oz Bottle", "8oz Bottle"
    sku VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(50) NOT NULL, -- "6oz", "8oz"
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    weight DECIMAL(8,2),
    shipping_weight DECIMAL(8,2),
    barcode VARCHAR(100),
    track_inventory BOOLEAN DEFAULT TRUE,
    inventory_policy ENUM('deny', 'continue') DEFAULT 'deny',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_variants_product (product_id),
    INDEX idx_variants_sku (sku),
    INDEX idx_variants_size (size),
    INDEX idx_variants_active (is_active)
);

-- Product badges/labels
CREATE TABLE product_badges (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    badge_type ENUM('best_seller', 'organic', 'hot', 'premium', 'new', 'sale', 'limited') NOT NULL,
    label VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#f59e0b', -- Hex color
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_badges_product (product_id),
    INDEX idx_badges_type (badge_type),
    INDEX idx_badges_active (is_active),
    INDEX idx_badges_expires (expires_at)
);

-- ================================================================
-- INVENTORY MANAGEMENT
-- ================================================================

-- Inventory tracking
CREATE TABLE inventory (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_variant_id VARCHAR(36) NOT NULL,
    location VARCHAR(100) DEFAULT 'main_warehouse',
    quantity_available INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0, -- Items in pending orders
    quantity_committed INT NOT NULL DEFAULT 0, -- Items in confirmed orders
    reorder_level INT DEFAULT 10,
    reorder_quantity INT DEFAULT 50,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    UNIQUE KEY uk_inventory_variant_location (product_variant_id, location),
    INDEX idx_inventory_location (location),
    INDEX idx_inventory_available (quantity_available),
    INDEX idx_inventory_reorder (reorder_level)
);

-- Inventory movements (stock in/out tracking)
CREATE TABLE inventory_movements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_variant_id VARCHAR(36) NOT NULL,
    location VARCHAR(100) DEFAULT 'main_warehouse',
    movement_type ENUM('purchase', 'sale', 'adjustment', 'transfer', 'return', 'damage') NOT NULL,
    quantity INT NOT NULL, -- Positive for stock in, negative for stock out
    reference_type ENUM('order', 'adjustment', 'purchase_order', 'return') NULL,
    reference_id VARCHAR(36) NULL,
    cost_per_unit DECIMAL(10,2),
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_movements_variant (product_variant_id),
    INDEX idx_movements_type (movement_type),
    INDEX idx_movements_reference (reference_type, reference_id),
    INDEX idx_movements_date (created_at)
);

-- ================================================================
-- SHOPPING CART AND SESSIONS
-- ================================================================

-- Shopping cart sessions (for both logged in and guest users)
CREATE TABLE cart_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NULL,
    session_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cart_sessions_user (user_id),
    INDEX idx_cart_sessions_token (session_token),
    INDEX idx_cart_sessions_expires (expires_at)
);

-- Cart items
CREATE TABLE cart_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cart_session_id VARCHAR(36) NOT NULL,
    product_variant_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    preferred_delivery_date DATE NULL,
    special_instructions TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cart_session_id) REFERENCES cart_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cart_items (cart_session_id, product_variant_id),
    INDEX idx_cart_items_session (cart_session_id),
    INDEX idx_cart_items_product (product_variant_id)
);

-- ================================================================
-- ORDERS AND TRANSACTIONS
-- ================================================================

-- Orders
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36) NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'partially_paid', 'refunded', 'partially_refunded', 'failed') DEFAULT 'pending',
    fulfillment_status ENUM('unfulfilled', 'partial', 'fulfilled') DEFAULT 'unfulfilled',
    
    -- Customer information (stored here for historical accuracy)
    customer_email VARCHAR(320) NOT NULL,
    customer_phone VARCHAR(20),
    
    -- Billing address
    billing_first_name VARCHAR(100) NOT NULL,
    billing_last_name VARCHAR(100) NOT NULL,
    billing_address_line1 VARCHAR(255) NOT NULL,
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100) NOT NULL,
    billing_state VARCHAR(100) NOT NULL,
    billing_zip_code VARCHAR(20) NOT NULL,
    billing_country VARCHAR(100) NOT NULL,
    
    -- Shipping address
    shipping_first_name VARCHAR(100) NOT NULL,
    shipping_last_name VARCHAR(100) NOT NULL,
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_zip_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20),
    delivery_instructions TEXT,
    preferred_delivery_date DATE,
    
    -- Order totals
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    -- Currency and locale
    currency CHAR(3) DEFAULT 'USD',
    tax_rate DECIMAL(5,4) DEFAULT 0.0800, -- 8% tax rate
    
    -- Timestamps
    confirmed_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_orders_number (order_number),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_payment_status (payment_status),
    INDEX idx_orders_email (customer_email),
    INDEX idx_orders_date (created_at),
    INDEX idx_orders_delivery_date (preferred_delivery_date)
);

-- Order items
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    product_variant_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL, -- Snapshot for historical accuracy
    product_sku VARCHAR(100) NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Product snapshot data
    product_weight DECIMAL(8,2),
    product_image_url VARCHAR(500),
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_variant_id)
);

-- ================================================================
-- PROMOTIONS AND DISCOUNTS
-- ================================================================

-- Coupon codes and promotions
CREATE TABLE coupons (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('fixed_amount', 'percentage', 'free_shipping') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount_amount DECIMAL(10,2) NULL,
    usage_limit INT NULL, -- NULL = unlimited
    usage_count INT DEFAULT 0,
    usage_limit_per_customer INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_active (is_active),
    INDEX idx_coupons_dates (starts_at, expires_at),
    INDEX idx_coupons_usage (usage_count, usage_limit)
);

-- Insert default coupons
INSERT INTO coupons (code, name, description, type, value, minimum_order_amount) VALUES 
('PICKLE50', 'Save $5', 'Save $5 on your order', 'fixed_amount', 5.00, 0.00),
('WELCOME10', '10% Off First Order', '10% off first order', 'percentage', 10.00, 0.00),
('FREESHIP', 'Free Shipping', 'Free shipping on any order', 'free_shipping', 5.99, 0.00);

-- Coupon usage tracking
CREATE TABLE coupon_usage (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    coupon_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_coupon_usage_coupon (coupon_id),
    INDEX idx_coupon_usage_order (order_id),
    INDEX idx_coupon_usage_user (user_id),
    INDEX idx_coupon_usage_date (used_at)
);

-- ================================================================
-- PAYMENTS AND TRANSACTIONS
-- ================================================================

-- Payment transactions
CREATE TABLE payment_transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    transaction_id VARCHAR(255) NOT NULL, -- External payment processor transaction ID
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay') NOT NULL,
    payment_processor ENUM('stripe', 'paypal', 'square') NOT NULL,
    status ENUM('pending', 'processing', 'success', 'failed', 'cancelled', 'refunded', 'partially_refunded') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0.00,
    currency CHAR(3) DEFAULT 'USD',
    
    -- Card information (for credit/debit cards)
    card_last_four CHAR(4),
    card_brand VARCHAR(20),
    
    -- Transaction details
    processor_response TEXT,
    failure_reason VARCHAR(255),
    reference_number VARCHAR(255),
    
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    INDEX idx_payment_transactions_order (order_id),
    INDEX idx_payment_transactions_transaction (transaction_id),
    INDEX idx_payment_transactions_status (status),
    INDEX idx_payment_transactions_date (created_at)
);

-- Refunds
CREATE TABLE refunds (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    payment_transaction_id VARCHAR(36) NOT NULL,
    refund_transaction_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason ENUM('requested_by_customer', 'out_of_stock', 'damaged', 'quality_issue', 'wrong_item') NOT NULL,
    notes TEXT,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    processed_by VARCHAR(36),
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (payment_transaction_id) REFERENCES payment_transactions(id) ON DELETE RESTRICT,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_refunds_order (order_id),
    INDEX idx_refunds_transaction (payment_transaction_id),
    INDEX idx_refunds_status (status),
    INDEX idx_refunds_date (created_at)
);

-- ================================================================
-- SHIPPING AND FULFILLMENT
-- ================================================================

-- Shipping methods
CREATE TABLE shipping_methods (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    carrier VARCHAR(100), -- UPS, FedEx, USPS, etc.
    service_code VARCHAR(50), -- Carrier's service code
    base_rate DECIMAL(10,2) NOT NULL,
    rate_per_pound DECIMAL(10,2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10,2) NULL, -- Minimum order for free shipping
    max_weight DECIMAL(8,2) NULL,
    estimated_days_min INT DEFAULT 1,
    estimated_days_max INT DEFAULT 7,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_shipping_methods_active (is_active),
    INDEX idx_shipping_methods_order (display_order)
);

-- Insert default shipping methods
INSERT INTO shipping_methods (name, description, carrier, base_rate, free_shipping_threshold, estimated_days_min, estimated_days_max) VALUES 
('Standard Shipping', 'Standard ground shipping', 'USPS', 5.99, 25.00, 3, 7),
('Express Shipping', 'Express 2-day shipping', 'FedEx', 12.99, NULL, 1, 2),
('Overnight Shipping', 'Next business day delivery', 'FedEx', 24.99, NULL, 1, 1);

-- Shipments
CREATE TABLE shipments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id VARCHAR(36) NOT NULL,
    shipping_method_id VARCHAR(36) NOT NULL,
    tracking_number VARCHAR(255),
    carrier VARCHAR(100) NOT NULL,
    status ENUM('pending', 'shipped', 'in_transit', 'delivered', 'exception', 'returned') DEFAULT 'pending',
    
    -- Shipping details
    shipped_from_address TEXT,
    shipped_to_address TEXT,
    weight DECIMAL(8,2),
    length DECIMAL(8,2),
    width DECIMAL(8,2),
    height DECIMAL(8,2),
    
    -- Shipping costs
    shipping_cost DECIMAL(10,2) NOT NULL,
    insurance_cost DECIMAL(10,2) DEFAULT 0.00,
    
    shipped_at TIMESTAMP NULL,
    estimated_delivery_date DATE NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE RESTRICT,
    INDEX idx_shipments_order (order_id),
    INDEX idx_shipments_tracking (tracking_number),
    INDEX idx_shipments_status (status),
    INDEX idx_shipments_delivery_date (estimated_delivery_date)
);

-- ================================================================
-- CUSTOMER ENGAGEMENT
-- ================================================================

-- Product reviews and ratings
CREATE TABLE product_reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,
    order_id VARCHAR(36) NULL, -- Link to verified purchase
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    reported_count INT DEFAULT 0,
    reviewer_name VARCHAR(255), -- For anonymous reviews
    reviewer_email VARCHAR(320), -- For anonymous reviews
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_reviews_product (product_id),
    INDEX idx_reviews_user (user_id),
    INDEX idx_reviews_rating (rating),
    INDEX idx_reviews_approved (is_approved),
    INDEX idx_reviews_verified (is_verified_purchase),
    INDEX idx_reviews_date (created_at)
);

-- Wishlist items
CREATE TABLE wishlist_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    variant_id VARCHAR(36) NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    UNIQUE KEY uk_wishlist_user_product (user_id, product_id, variant_id),
    INDEX idx_wishlist_user (user_id),
    INDEX idx_wishlist_product (product_id)
);

-- Newsletter subscriptions
CREATE TABLE newsletter_subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(320) UNIQUE NOT NULL,
    user_id VARCHAR(36) NULL,
    status ENUM('subscribed', 'unsubscribed', 'pending') DEFAULT 'pending',
    subscription_source VARCHAR(100), -- website, checkout, etc.
    confirmed_at TIMESTAMP NULL,
    unsubscribed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_newsletter_email (email),
    INDEX idx_newsletter_status (status)
);

-- ================================================================
-- ANALYTICS AND REPORTING
-- ================================================================

-- Website analytics events
CREATE TABLE analytics_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(36) NULL,
    event_type ENUM('page_view', 'product_view', 'add_to_cart', 'remove_from_cart', 'search', 'purchase') NOT NULL,
    page_url VARCHAR(500),
    referrer_url VARCHAR(500),
    product_id VARCHAR(36) NULL,
    search_term VARCHAR(255) NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_analytics_session (session_id),
    INDEX idx_analytics_user (user_id),
    INDEX idx_analytics_type (event_type),
    INDEX idx_analytics_product (product_id),
    INDEX idx_analytics_date (created_at)
);

-- ================================================================
-- CONTENT MANAGEMENT
-- ================================================================

-- Static pages (FAQ, Privacy Policy, Terms, etc.)
CREATE TABLE pages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    template VARCHAR(100) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_pages_slug (slug),
    INDEX idx_pages_published (is_published)
);

-- Insert default pages
INSERT INTO pages (title, slug, content, meta_title, meta_description) VALUES 
('Frequently Asked Questions', 'faq', '<h1>Frequently Asked Questions</h1><p>Coming soon...</p>', 'FAQ - The Pickle Pot', 'Find answers to common questions about our products and services.'),
('Privacy Policy', 'privacy-policy', '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>', 'Privacy Policy - The Pickle Pot', 'Our privacy policy explains how we collect and use your information.'),
('Terms & Conditions', 'terms-conditions', '<h1>Terms & Conditions</h1><p>Terms of service...</p>', 'Terms & Conditions - The Pickle Pot', 'Terms and conditions for using our website and services.'),
('Our Story', 'our-story', '<h1>Our Story</h1><p>The Pickle Pot story...</p>', 'Our Story - The Pickle Pot', 'Learn about our family tradition and commitment to authentic flavors.');

-- Blog posts (for SEO and content marketing)
CREATE TABLE blog_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    featured_image_url VARCHAR(500),
    author_id VARCHAR(36),
    category VARCHAR(100),
    tags JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_blog_slug (slug),
    INDEX idx_blog_status (status),
    INDEX idx_blog_published (published_at),
    INDEX idx_blog_category (category),
    FULLTEXT idx_blog_search (title, excerpt, content)
);

-- ================================================================
-- SYSTEM CONFIGURATION
-- ================================================================

-- Application settings
CREATE TABLE settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Whether setting can be accessed from frontend
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_settings_key (setting_key),
    INDEX idx_settings_public (is_public)
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public) VALUES 
('site_name', 'The Pickle Pot', 'string', 'Website name', TRUE),
('site_tagline', 'Authentic • Traditional • Fresh', 'string', 'Website tagline', TRUE),
('default_tax_rate', '0.0800', 'number', 'Default tax rate (8%)', FALSE),
('free_shipping_threshold', '25.00', 'number', 'Minimum order for free shipping', TRUE),
('contact_email', 'hello@thepicklepot.com', 'string', 'Contact email', TRUE),
('contact_phone', '+1 408 219 1573', 'string', 'Contact phone', TRUE),
('business_address', 'San Jose, CA, USA', 'string', 'Business address', TRUE),
('currency', 'USD', 'string', 'Default currency', TRUE),
('max_cart_items', '50', 'number', 'Maximum items in cart', FALSE),
('session_timeout', '2592000', 'number', 'Cart session timeout in seconds (30 days)', FALSE);

-- ================================================================
-- TRIGGERS AND STORED PROCEDURES
-- ================================================================

-- Trigger to update inventory when order is confirmed
DELIMITER //
CREATE TRIGGER update_inventory_on_order_confirm 
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
        UPDATE inventory i
        JOIN order_items oi ON i.product_variant_id = oi.product_variant_id
        SET i.quantity_committed = i.quantity_committed + oi.quantity,
            i.quantity_available = i.quantity_available - oi.quantity
        WHERE oi.order_id = NEW.id;
        
        -- Log inventory movements
        INSERT INTO inventory_movements (product_variant_id, movement_type, quantity, reference_type, reference_id)
        SELECT oi.product_variant_id, 'sale', -oi.quantity, 'order', NEW.id
        FROM order_items oi
        WHERE oi.order_id = NEW.id;
    END IF;
END//
DELIMITER ;

-- Trigger to update product rating when review is added
DELIMITER //
CREATE TRIGGER update_product_rating_on_review
AFTER INSERT ON product_reviews
FOR EACH ROW
BEGIN
    IF NEW.is_approved = TRUE THEN
        UPDATE products p
        SET p.average_rating = (
            SELECT AVG(rating)
            FROM product_reviews pr
            WHERE pr.product_id = NEW.product_id AND pr.is_approved = TRUE
        ),
        p.review_count = (
            SELECT COUNT(*)
            FROM product_reviews pr
            WHERE pr.product_id = NEW.product_id AND pr.is_approved = TRUE
        )
        WHERE p.id = NEW.product_id;
    END IF;
END//
DELIMITER ;

-- ================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ================================================================

-- Composite indexes for common query patterns
CREATE INDEX idx_orders_user_status_date ON orders(user_id, status, created_at);
CREATE INDEX idx_products_category_status_featured ON products(category_id, status, featured);
CREATE INDEX idx_inventory_product_location_available ON inventory(product_variant_id, location, quantity_available);
CREATE INDEX idx_cart_items_session_updated ON cart_items(cart_session_id, updated_at);
CREATE INDEX idx_reviews_product_approved_rating ON product_reviews(product_id, is_approved, rating);

-- ================================================================
-- VIEWS FOR COMMON QUERIES
-- ================================================================

-- Product listing view with aggregated data
CREATE VIEW product_list_view AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.short_description,
    p.price_6oz,
    p.price_8oz,
    p.compare_price_6oz,
    p.compare_price_8oz,
    p.featured,
    p.status,
    c.name as category_name,
    c.slug as category_slug,
    (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = TRUE LIMIT 1) as primary_image,
    (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id AND pr.is_approved = TRUE) as review_count,
    (SELECT AVG(rating) FROM product_reviews pr WHERE pr.product_id = p.id AND pr.is_approved = TRUE) as average_rating,
    (SELECT GROUP_CONCAT(pb.label) FROM product_badges pb WHERE pb.product_id = p.id AND pb.is_active = TRUE) as badges
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active';

-- Order summary view
CREATE VIEW order_summary_view AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    CONCAT(o.shipping_first_name, ' ', o.shipping_last_name) as customer_name,
    o.customer_email,
    COUNT(oi.id) as item_count,
    SUM(oi.quantity) as total_quantity
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- ================================================================
-- SAMPLE DATA FOR TESTING
-- ================================================================

-- Insert sample products
INSERT INTO products (name, slug, description, category_id, sku, price_6oz, price_8oz, compare_price_6oz, compare_price_8oz, featured) 
SELECT 
    'Grandma\'s Mango Pickle', 
    'grandmas-mango-pickle', 
    'Traditional mango pickle made with authentic spices and time-tested recipes',
    c.id,
    'PICKLE-MANGO-001',
    12.99,
    16.99,
    14.99,
    18.99,
    TRUE
FROM categories c WHERE c.slug = 'pickles' LIMIT 1;

INSERT INTO products (name, slug, description, category_id, sku, price_6oz, price_8oz, compare_price_6oz, compare_price_8oz, featured)
SELECT 
    'Authentic Turmeric Powder',
    'authentic-turmeric-powder',
    'Premium quality turmeric powder, organically grown and freshly ground',
    c.id,
    'POWDER-TURMERIC-001',
    9.99,
    13.99,
    11.99,
    15.99,
    TRUE
FROM categories c WHERE c.slug = 'powders' LIMIT 1;

-- ================================================================
-- CLEANUP AND MAINTENANCE
-- ================================================================

-- Cleanup expired cart sessions (run periodically)
-- DELETE FROM cart_sessions WHERE expires_at < NOW();

-- Cleanup old analytics events (keep 1 year)
-- DELETE FROM analytics_events WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- ================================================================
-- END OF SCHEMA
-- ================================================================

-- This comprehensive schema supports:
-- ✅ User accounts and authentication
-- ✅ Product catalog with variants and inventory
-- ✅ Shopping cart and checkout
-- ✅ Order management and fulfillment
-- ✅ Payment processing and refunds
-- ✅ Shipping and delivery tracking
-- ✅ Promotions and discount codes
-- ✅ Customer reviews and ratings
-- ✅ Content management (pages, blog)
-- ✅ Analytics and reporting
-- ✅ Email marketing and newsletters
-- ✅ Wishlist functionality
-- ✅ Multi-size product variants
-- ✅ Inventory tracking and management
-- ✅ Data integrity with proper constraints
-- ✅ Performance optimization with indexes
-- ✅ Comprehensive audit trails
-- ✅ Scalable architecture for growth
