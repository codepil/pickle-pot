"""
Test utilities and helper functions for The Pickle Pot API tests.
"""

import uuid
import random
from decimal import Decimal
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from faker import Faker

fake = Faker()

class TestDataGenerator:
    """Helper class for generating test data."""
    
    @staticmethod
    def generate_uuid() -> str:
        """Generate a UUID string."""
        return str(uuid.uuid4())
    
    @staticmethod
    def generate_email() -> str:
        """Generate a random email address."""
        return fake.email()
    
    @staticmethod
    def generate_phone() -> str:
        """Generate a random phone number."""
        return fake.phone_number()
    
    @staticmethod
    def generate_address() -> Dict[str, Any]:
        """Generate a random address."""
        return {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "address_line1": fake.street_address(),
            "address_line2": fake.secondary_address() if random.choice([True, False]) else None,
            "city": fake.city(),
            "state": fake.state_abbr(),
            "zip_code": fake.zipcode(),
            "country": "United States",
            "phone": fake.phone_number()
        }
    
    @staticmethod
    def generate_product_data(category_id: str) -> Dict[str, Any]:
        """Generate random product data."""
        base_name = fake.word().title()
        return {
            "name": f"{base_name} Pickle",
            "slug": f"{base_name.lower()}-pickle",
            "description": fake.text(max_nb_chars=200),
            "short_description": fake.text(max_nb_chars=100),
            "category_id": category_id,
            "sku": f"PICKLE-{fake.random_int(1000, 9999)}",
            "status": random.choice(["active", "inactive"]),
            "featured": random.choice([True, False]),
            "price_6oz": Decimal(str(round(random.uniform(8.99, 15.99), 2))),
            "price_8oz": Decimal(str(round(random.uniform(12.99, 19.99), 2))),
            "ingredients": "Cucumbers, vinegar, salt, spices",
            "allergen_info": random.choice(["None", "Contains sulfites"]),
            "storage_instructions": "Store in cool, dry place"
        }
    
    @staticmethod
    def generate_order_data(user_id: Optional[str] = None) -> Dict[str, Any]:
        """Generate random order data."""
        subtotal = Decimal(str(round(random.uniform(20.00, 100.00), 2)))
        tax_rate = Decimal('0.08')
        tax_amount = subtotal * tax_rate
        shipping_amount = Decimal('5.99')
        total_amount = subtotal + tax_amount + shipping_amount
        
        billing_address = TestDataGenerator.generate_address()
        shipping_address = TestDataGenerator.generate_address()
        
        return {
            "user_id": user_id,
            "customer_email": fake.email(),
            "customer_phone": fake.phone_number(),
            "billing_first_name": billing_address["first_name"],
            "billing_last_name": billing_address["last_name"],
            "billing_address_line1": billing_address["address_line1"],
            "billing_address_line2": billing_address["address_line2"],
            "billing_city": billing_address["city"],
            "billing_state": billing_address["state"],
            "billing_zip_code": billing_address["zip_code"],
            "billing_country": billing_address["country"],
            "shipping_first_name": shipping_address["first_name"],
            "shipping_last_name": shipping_address["last_name"],
            "shipping_address_line1": shipping_address["address_line1"],
            "shipping_address_line2": shipping_address["address_line2"],
            "shipping_city": shipping_address["city"],
            "shipping_state": shipping_address["state"],
            "shipping_zip_code": shipping_address["zip_code"],
            "shipping_country": shipping_address["country"],
            "subtotal": subtotal,
            "tax_amount": tax_amount,
            "shipping_amount": shipping_amount,
            "total_amount": total_amount
        }

class TestAssertions:
    """Helper class for common test assertions."""
    
    @staticmethod
    def assert_valid_uuid(uuid_string: str):
        """Assert that a string is a valid UUID."""
        try:
            uuid.UUID(uuid_string)
        except ValueError:
            raise AssertionError(f"'{uuid_string}' is not a valid UUID")
    
    @staticmethod
    def assert_valid_email(email: str):
        """Assert that a string is a valid email."""
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise AssertionError(f"'{email}' is not a valid email address")
    
    @staticmethod
    def assert_decimal_equal(actual: Decimal, expected: Decimal, places: int = 2):
        """Assert that two Decimal values are equal to specified decimal places."""
        if round(actual, places) != round(expected, places):
            raise AssertionError(f"Decimal values not equal: {actual} != {expected}")
    
    @staticmethod
    def assert_datetime_recent(dt: datetime, seconds: int = 10):
        """Assert that a datetime is within the last N seconds."""
        now = datetime.utcnow()
        if dt < now - timedelta(seconds=seconds) or dt > now:
            raise AssertionError(f"Datetime {dt} is not recent (within {seconds} seconds)")

class DatabaseHelper:
    """Helper class for database operations in tests."""
    
    @staticmethod
    def create_test_user(db_session, **kwargs):
        """Create a test user with default or provided values."""
        from models.user import User
        
        default_data = {
            "email": TestDataGenerator.generate_email(),
            "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "is_active": True,
            "is_verified": True
        }
        default_data.update(kwargs)
        
        user = User(**default_data)
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user
    
    @staticmethod
    def create_test_category(db_session, **kwargs):
        """Create a test category with default or provided values."""
        from models.product import Category
        
        default_data = {
            "name": fake.word().title(),
            "slug": fake.slug(),
            "description": fake.text(max_nb_chars=100),
            "is_active": True
        }
        default_data.update(kwargs)
        
        category = Category(**default_data)
        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)
        return category
    
    @staticmethod
    def create_test_product(db_session, category_id: str, **kwargs):
        """Create a test product with default or provided values."""
        from models.product import Product
        
        product_data = TestDataGenerator.generate_product_data(category_id)
        product_data.update(kwargs)
        
        product = Product(**product_data)
        db_session.add(product)
        db_session.commit()
        db_session.refresh(product)
        return product

class APITestHelper:
    """Helper class for API testing."""
    
    @staticmethod
    def assert_response_schema(response_data: Dict[str, Any], required_fields: list):
        """Assert that response data contains all required fields."""
        for field in required_fields:
            if field not in response_data:
                raise AssertionError(f"Required field '{field}' missing from response")
    
    @staticmethod
    def assert_error_response(response_data: Dict[str, Any]):
        """Assert that response is a valid error response."""
        required_fields = ["error", "message"]
        APITestHelper.assert_response_schema(response_data, required_fields)
    
    @staticmethod
    def assert_pagination_response(response_data: Dict[str, Any]):
        """Assert that response is a valid paginated response."""
        required_fields = ["items", "page", "limit", "total", "totalPages"]
        APITestHelper.assert_response_schema(response_data, required_fields)
        
        assert isinstance(response_data["items"], list)
        assert isinstance(response_data["page"], int)
        assert isinstance(response_data["limit"], int)
        assert isinstance(response_data["total"], int)
        assert isinstance(response_data["totalPages"], int)

class MockHelper:
    """Helper class for mocking external services."""
    
    @staticmethod
    def mock_stripe_payment_success():
        """Mock a successful Stripe payment."""
        return {
            "id": "pi_test_123456789",
            "status": "succeeded",
            "amount": 2999,  # $29.99 in cents
            "currency": "usd",
            "charges": {
                "data": [
                    {
                        "id": "ch_test_123456789",
                        "amount": 2999,
                        "payment_method_details": {
                            "card": {
                                "brand": "visa",
                                "last4": "4242"
                            }
                        }
                    }
                ]
            }
        }
    
    @staticmethod
    def mock_shipping_rates():
        """Mock shipping rate calculation."""
        return [
            {
                "shipping_method_id": "standard",
                "name": "Standard Shipping",
                "rate": 5.99,
                "estimated_days_min": 3,
                "estimated_days_max": 7
            },
            {
                "shipping_method_id": "express",
                "name": "Express Shipping",
                "rate": 12.99,
                "estimated_days_min": 1,
                "estimated_days_max": 2
            }
        ]
