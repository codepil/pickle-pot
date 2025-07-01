import pytest
import asyncio
from typing import Generator, AsyncGenerator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import uuid
from datetime import datetime, timedelta

from core.database import Base, get_db
from core.config import settings
from main import app
from models import User, Category, Product, ProductVariant, Order, CartSession

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session) -> Generator[TestClient, None, None]:
    """Create a test client."""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def sample_user(db_session):
    """Create a sample user for testing."""
    user = User(
        id=str(uuid.uuid4()),
        email="test@example.com",
        hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # secret
        first_name="John",
        last_name="Doe",
        is_active=True,
        is_verified=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def sample_category(db_session):
    """Create a sample category for testing."""
    category = Category(
        id=str(uuid.uuid4()),
        name="Test Category",
        slug="test-category",
        description="A test category",
        is_active=True
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category

@pytest.fixture
def sample_product(db_session, sample_category):
    """Create a sample product for testing."""
    product = Product(
        id=str(uuid.uuid4()),
        name="Test Product",
        slug="test-product",
        description="A test product",
        category_id=sample_category.id,
        sku="TEST-001",
        status="active",
        price_6oz=12.99,
        price_8oz=16.99,
        featured=True
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    return product

@pytest.fixture
def sample_product_variant(db_session, sample_product):
    """Create a sample product variant for testing."""
    variant = ProductVariant(
        id=str(uuid.uuid4()),
        product_id=sample_product.id,
        name="6oz Bottle",
        sku="TEST-001-6OZ",
        size="6oz",
        price=12.99,
        is_active=True
    )
    db_session.add(variant)
    db_session.commit()
    db_session.refresh(variant)
    return variant

@pytest.fixture
def sample_cart_session(db_session, sample_user):
    """Create a sample cart session for testing."""
    cart_session = CartSession(
        id=str(uuid.uuid4()),
        user_id=sample_user.id,
        session_token="test-session-token",
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db_session.add(cart_session)
    db_session.commit()
    db_session.refresh(cart_session)
    return cart_session

@pytest.fixture
def auth_headers(client, sample_user):
    """Get authentication headers for testing protected endpoints."""
    # This would typically involve creating a JWT token
    # For now, we'll mock the authentication
    return {"Authorization": "Bearer test-token"}

@pytest.fixture
def admin_user(db_session):
    """Create an admin user for testing admin endpoints."""
    admin = User(
        id=str(uuid.uuid4()),
        email="admin@example.com",
        hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        first_name="Admin",
        last_name="User",
        is_active=True,
        is_verified=True,
        is_admin=True
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin

@pytest.fixture
def admin_headers(client, admin_user):
    """Get admin authentication headers."""
    return {"Authorization": "Bearer admin-token"}

# Test data factories
class UserFactory:
    @staticmethod
    def create_user_data(**kwargs):
        """Create user data for testing."""
        default_data = {
            "email": "user@example.com",
            "password": "testpassword123",
            "firstName": "Test",
            "lastName": "User",
            "phone": "+1234567890"
        }
        default_data.update(kwargs)
        return default_data

class ProductFactory:
    @staticmethod
    def create_product_data(category_id, **kwargs):
        """Create product data for testing."""
        default_data = {
            "name": "Test Pickle",
            "slug": "test-pickle",
            "description": "A delicious test pickle",
            "short_description": "Test pickle for testing",
            "category_id": category_id,
            "sku": f"TEST-{uuid.uuid4().hex[:8].upper()}",
            "status": "active",
            "featured": False,
            "price_6oz": 12.99,
            "price_8oz": 16.99,
            "ingredients": "Cucumbers, vinegar, salt, spices",
            "allergen_info": "None",
            "storage_instructions": "Store in cool, dry place"
        }
        default_data.update(kwargs)
        return default_data

class OrderFactory:
    @staticmethod
    def create_order_data(user_id=None, **kwargs):
        """Create order data for testing."""
        default_data = {
            "user_id": user_id,
            "customer_email": "customer@example.com",
            "billing_first_name": "John",
            "billing_last_name": "Doe",
            "billing_address_line1": "123 Main St",
            "billing_city": "Anytown",
            "billing_state": "CA",
            "billing_zip_code": "12345",
            "billing_country": "United States",
            "shipping_first_name": "John",
            "shipping_last_name": "Doe",
            "shipping_address_line1": "123 Main St",
            "shipping_city": "Anytown",
            "shipping_state": "CA",
            "shipping_zip_code": "12345",
            "shipping_country": "United States",
            "subtotal": 25.98,
            "tax_amount": 2.08,
            "shipping_amount": 5.99,
            "total_amount": 34.05,
            "items": []
        }
        default_data.update(kwargs)
        return default_data
