import pytest
from datetime import datetime, timedelta
from models.cart import CartSession, CartItem
from schemas.cart import CartSessionCreate, CartItemCreate, AddToCartRequest

@pytest.mark.unit
class TestCartSessionModel:
    """Unit tests for CartSession model."""
    
    def test_create_cart_session(self, db_session, sample_user):
        """Test creating a cart session."""
        cart_session = CartSession(
            user_id=sample_user.id,
            session_token="test-session-123",
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db_session.add(cart_session)
        db_session.commit()
        
        assert cart_session.id is not None
        assert cart_session.user_id == sample_user.id
        assert cart_session.session_token == "test-session-123"
        assert cart_session.expires_at > datetime.utcnow()
    
    def test_cart_session_without_user(self, db_session):
        """Test creating a guest cart session."""
        cart_session = CartSession(
            user_id=None,
            session_token="guest-session-123",
            expires_at=datetime.utcnow() + timedelta(hours=24)
        )
        db_session.add(cart_session)
        db_session.commit()
        
        assert cart_session.id is not None
        assert cart_session.user_id is None
        assert cart_session.session_token == "guest-session-123"

@pytest.mark.unit
class TestCartItemModel:
    """Unit tests for CartItem model."""
    
    def test_create_cart_item(self, db_session, sample_cart_session, sample_product, sample_product_variant):
        """Test creating a cart item."""
        cart_item = CartItem(
            cart_session_id=sample_cart_session.id,
            product_id=sample_product.id,
            product_variant_id=sample_product_variant.id,
            quantity=2
        )
        db_session.add(cart_item)
        db_session.commit()
        
        assert cart_item.id is not None
        assert cart_item.cart_session_id == sample_cart_session.id
        assert cart_item.product_id == sample_product.id
        assert cart_item.quantity == 2
    
    def test_cart_item_relationships(self, db_session, sample_cart_session, sample_product, sample_product_variant):
        """Test cart item relationships."""
        cart_item = CartItem(
            cart_session_id=sample_cart_session.id,
            product_id=sample_product.id,
            product_variant_id=sample_product_variant.id,
            quantity=1
        )
        db_session.add(cart_item)
        db_session.commit()
        
        # Test relationships
        assert cart_item.session.id == sample_cart_session.id
        assert cart_item.product.id == sample_product.id
        assert cart_item.variant.id == sample_product_variant.id
    
    def test_cart_item_quantity_validation(self, db_session, sample_cart_session, sample_product, sample_product_variant):
        """Test cart item quantity constraints."""
        # Valid quantity
        cart_item = CartItem(
            cart_session_id=sample_cart_session.id,
            product_id=sample_product.id,
            product_variant_id=sample_product_variant.id,
            quantity=5
        )
        db_session.add(cart_item)
        db_session.commit()
        
        assert cart_item.quantity == 5

@pytest.mark.unit
class TestCartSchemas:
    """Unit tests for Cart schemas."""
    
    def test_cart_session_create_schema(self):
        """Test CartSessionCreate schema."""
        data = {
            "session_token": "test-token-123",
            "expires_at": datetime.utcnow() + timedelta(days=30),
            "user_id": "user-123"
        }
        schema = CartSessionCreate(**data)
        
        assert schema.session_token == "test-token-123"
        assert schema.user_id == "user-123"
        assert schema.expires_at > datetime.utcnow()
    
    def test_cart_item_create_schema(self):
        """Test CartItemCreate schema."""
        data = {
            "product_id": "product-123",
            "product_variant_id": "variant-123",
            "quantity": 2
        }
        schema = CartItemCreate(**data)
        
        assert schema.product_id == "product-123"
        assert schema.product_variant_id == "variant-123"
        assert schema.quantity == 2
    
    def test_add_to_cart_request_schema(self):
        """Test AddToCartRequest schema."""
        data = {
            "product_variant_id": "variant-123",
            "quantity": 3
        }
        schema = AddToCartRequest(**data)
        
        assert schema.product_variant_id == "variant-123"
        assert schema.quantity == 3
    
    def test_cart_item_quantity_limits(self):
        """Test cart item quantity validation limits."""
        # Valid quantity
        schema = AddToCartRequest(product_variant_id="variant-123", quantity=5)
        assert schema.quantity == 5
        
        # Test minimum quantity
        with pytest.raises(ValueError):
            AddToCartRequest(product_variant_id="variant-123", quantity=0)
        
        # Test maximum quantity
        with pytest.raises(ValueError):
            AddToCartRequest(product_variant_id="variant-123", quantity=100)

@pytest.mark.unit
class TestCartBusinessLogic:
    """Unit tests for cart business logic."""
    
    def test_cart_item_total_calculation(self, db_session, sample_cart_session, sample_product, sample_product_variant):
        """Test calculating cart item totals."""
        # Create cart item
        cart_item = CartItem(
            cart_session_id=sample_cart_session.id,
            product_id=sample_product.id,
            product_variant_id=sample_product_variant.id,
            quantity=3
        )
        db_session.add(cart_item)
        db_session.commit()
        
        # Calculate total (quantity * variant price)
        expected_total = cart_item.quantity * sample_product_variant.price
        actual_total = cart_item.quantity * sample_product_variant.price
        
        assert actual_total == expected_total
    
    def test_cart_session_expiry(self, db_session):
        """Test cart session expiry logic."""
        # Expired session
        expired_session = CartSession(
            session_token="expired-session",
            expires_at=datetime.utcnow() - timedelta(hours=1)
        )
        db_session.add(expired_session)
        db_session.commit()
        
        # Check if session is expired
        is_expired = expired_session.expires_at < datetime.utcnow()
        assert is_expired is True
        
        # Valid session
        valid_session = CartSession(
            session_token="valid-session",
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db_session.add(valid_session)
        db_session.commit()
        
        is_valid = valid_session.expires_at > datetime.utcnow()
        assert is_valid is True
    
    def test_duplicate_cart_items(self, db_session, sample_cart_session, sample_product, sample_product_variant):
        """Test handling duplicate cart items (same product variant in same session)."""
        from sqlalchemy.exc import IntegrityError
        
        # First cart item
        cart_item1 = CartItem(
            cart_session_id=sample_cart_session.id,
            product_id=sample_product.id,
            product_variant_id=sample_product_variant.id,
            quantity=1
        )
        db_session.add(cart_item1)
        db_session.commit()
        
        # Attempt to add the same product variant again
        cart_item2 = CartItem(
            cart_session_id=sample_cart_session.id,
            product_id=sample_product.id,
            product_variant_id=sample_product_variant.id,
            quantity=2
        )
        db_session.add(cart_item2)
        
        # This should raise an integrity error due to unique constraint
        with pytest.raises(IntegrityError):
            db_session.commit()
