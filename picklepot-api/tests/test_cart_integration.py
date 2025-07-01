import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta

@pytest.mark.integration
class TestCartAPIEndpoints:
    """Integration tests for Cart API endpoints."""
    
    def test_create_cart_session(self, client: TestClient):
        """Test creating a new cart session."""
        response = client.post("/api/cart/session")
        
        assert response.status_code == 201
        data = response.json()
        assert "session_id" in data
        assert "session_token" in data
        assert "expires_at" in data
    
    def test_add_item_to_cart(self, client: TestClient, sample_product_variant):
        """Test adding an item to cart."""
        # First create a cart session
        session_response = client.post("/api/cart/session")
        session_data = session_response.json()
        session_token = session_data["session_token"]
        
        # Add item to cart
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 2
        }
        
        response = client.post(
            f"/api/cart/{session_token}/items",
            json=cart_item_data
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["quantity"] == 2
        assert data["product_variant_id"] == sample_product_variant.id
    
    def test_get_cart_contents(self, client: TestClient, sample_product_variant):
        """Test retrieving cart contents."""
        # Create session and add item
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 1
        }
        client.post(f"/api/cart/{session_token}/items", json=cart_item_data)
        
        # Get cart contents
        response = client.get(f"/api/cart/{session_token}")
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "item_count" in data
        assert "subtotal" in data
        assert len(data["items"]) == 1
        assert data["item_count"] == 1
    
    def test_update_cart_item_quantity(self, client: TestClient, sample_product_variant):
        """Test updating cart item quantity."""
        # Setup cart with item
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 1
        }
        add_response = client.post(f"/api/cart/{session_token}/items", json=cart_item_data)
        item_id = add_response.json()["id"]
        
        # Update quantity
        update_data = {"quantity": 3}
        response = client.patch(
            f"/api/cart/{session_token}/items/{item_id}",
            json=update_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["quantity"] == 3
    
    def test_remove_cart_item(self, client: TestClient, sample_product_variant):
        """Test removing an item from cart."""
        # Setup cart with item
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 1
        }
        add_response = client.post(f"/api/cart/{session_token}/items", json=cart_item_data)
        item_id = add_response.json()["id"]
        
        # Remove item
        response = client.delete(f"/api/cart/{session_token}/items/{item_id}")
        
        assert response.status_code == 204
        
        # Verify item is removed
        cart_response = client.get(f"/api/cart/{session_token}")
        cart_data = cart_response.json()
        assert len(cart_data["items"]) == 0
    
    def test_clear_cart(self, client: TestClient, sample_product_variant):
        """Test clearing entire cart."""
        # Setup cart with items
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 2
        }
        client.post(f"/api/cart/{session_token}/items", json=cart_item_data)
        
        # Clear cart
        response = client.delete(f"/api/cart/{session_token}")
        
        assert response.status_code == 204
        
        # Verify cart is empty
        cart_response = client.get(f"/api/cart/{session_token}")
        cart_data = cart_response.json()
        assert len(cart_data["items"]) == 0
    
    def test_cart_validation(self, client: TestClient, sample_product_variant):
        """Test cart validation (stock availability, etc.)."""
        # Setup cart
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 1
        }
        client.post(f"/api/cart/{session_token}/items", json=cart_item_data)
        
        # Validate cart
        response = client.post(f"/api/cart/{session_token}/validate")
        
        assert response.status_code == 200
        data = response.json()
        assert "is_valid" in data
        assert "errors" in data
        assert "warnings" in data
    
    def test_merge_carts(self, client: TestClient, sample_product_variant, auth_headers):
        """Test merging guest cart with user cart."""
        # Create guest cart
        guest_session_response = client.post("/api/cart/session")
        guest_token = guest_session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 1
        }
        client.post(f"/api/cart/{guest_token}/items", json=cart_item_data)
        
        # Create user cart
        user_session_response = client.post(
            "/api/cart/session",
            headers=auth_headers
        )
        user_token = user_session_response.json()["session_token"]
        
        # Merge carts
        merge_data = {
            "guest_session_token": guest_token,
            "user_session_token": user_token
        }
        response = client.post("/api/cart/merge", json=merge_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "merged_items" in data
    
    def test_cart_totals_calculation(self, client: TestClient, sample_product_variant):
        """Test cart totals calculation including tax and shipping estimates."""
        # Setup cart
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 2
        }
        client.post(f"/api/cart/{session_token}/items", json=cart_item_data)
        
        # Get cart with totals
        response = client.get(f"/api/cart/{session_token}")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify totals are calculated
        assert "subtotal" in data
        assert "estimated_tax" in data
        assert "estimated_shipping" in data
        assert "estimated_total" in data
        
        # Verify calculations
        expected_subtotal = float(sample_product_variant.price) * 2
        assert float(data["subtotal"]) == expected_subtotal
    
    def test_invalid_cart_session(self, client: TestClient):
        """Test handling invalid cart session tokens."""
        response = client.get("/api/cart/invalid-token")
        
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
    
    def test_add_invalid_product_to_cart(self, client: TestClient):
        """Test adding non-existent product to cart."""
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": "non-existent-variant",
            "quantity": 1
        }
        
        response = client.post(
            f"/api/cart/{session_token}/items",
            json=cart_item_data
        )
        
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
    
    def test_cart_quantity_limits(self, client: TestClient, sample_product_variant):
        """Test cart quantity validation limits."""
        session_response = client.post("/api/cart/session")
        session_token = session_response.json()["session_token"]
        
        # Test invalid quantity (too high)
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 999
        }
        
        response = client.post(
            f"/api/cart/{session_token}/items",
            json=cart_item_data
        )
        
        assert response.status_code == 422  # Validation error
        data = response.json()
        assert "detail" in data
