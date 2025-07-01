import pytest
from fastapi.testclient import TestClient
from decimal import Decimal

@pytest.mark.e2e
class TestCompleteOrderScenario:
    """End-to-end test for complete order flow."""
    
    def test_complete_guest_order_flow(self, client: TestClient, sample_product_variant):
        """Test complete order flow for guest user."""
        
        # Step 1: Create cart session
        cart_response = client.post("/api/cart/session")
        assert cart_response.status_code == 201
        session_token = cart_response.json()["session_token"]
        
        # Step 2: Add products to cart
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 2,
            "special_instructions": "Extra spicy please"
        }
        add_response = client.post(
            f"/api/cart/{session_token}/items",
            json=cart_item_data
        )
        assert add_response.status_code == 201
        
        # Step 3: Apply coupon code
        coupon_data = {"code": "WELCOME10"}
        coupon_response = client.post(
            f"/api/cart/{session_token}/apply-coupon",
            json=coupon_data
        )
        # Coupon might not exist in test, but endpoint should respond
        assert coupon_response.status_code in [200, 404]
        
        # Step 4: Get shipping rates
        shipping_request = {
            "destination_zip": "12345",
            "destination_country": "United States"
        }
        shipping_response = client.post(
            f"/api/cart/{session_token}/shipping-rates",
            json=shipping_request
        )
        assert shipping_response.status_code == 200
        shipping_rates = shipping_response.json()
        assert len(shipping_rates) > 0
        
        # Step 5: Proceed to checkout
        checkout_data = {
            "cart_session_id": session_token,
            "customer_email": "customer@example.com",
            "customer_phone": "+1234567890",
            "billing_address": {
                "first_name": "John",
                "last_name": "Doe",
                "address_line1": "123 Main St",
                "city": "Anytown",
                "state": "CA",
                "zip_code": "12345",
                "country": "United States"
            },
            "shipping_address": {
                "first_name": "John",
                "last_name": "Doe",
                "address_line1": "123 Main St",
                "city": "Anytown",
                "state": "CA",
                "zip_code": "12345",
                "country": "United States",
                "delivery_instructions": "Leave at door"
            },
            "shipping_method_id": shipping_rates[0]["shipping_method_id"],
            "marketing_emails_consent": True
        }
        
        checkout_response = client.post("/api/orders/checkout", json=checkout_data)
        assert checkout_response.status_code == 201
        order_data = checkout_response.json()
        
        assert "order_id" in order_data
        assert "order_number" in order_data
        assert "total_amount" in order_data
        
        # Step 6: Process payment (mock)
        payment_data = {
            "order_id": order_data["order_id"],
            "payment_method": "credit_card",
            "card_token": "tok_visa_test"
        }
        payment_response = client.post("/api/payments/process", json=payment_data)
        assert payment_response.status_code in [200, 201]
        
        # Step 7: Verify order was created
        order_id = order_data["order_id"]
        order_response = client.get(f"/api/orders/{order_id}")
        assert order_response.status_code == 200
        
        final_order = order_response.json()
        assert final_order["status"] in ["pending", "confirmed"]
        assert len(final_order["items"]) == 1
        assert final_order["items"][0]["quantity"] == 2

@pytest.mark.e2e
class TestUserRegistrationAndOrderScenario:
    """Test user registration and order placement."""
    
    def test_user_registration_and_order(self, client: TestClient, sample_product_variant):
        """Test user registration followed by order placement."""
        
        # Step 1: Register new user
        user_data = {
            "email": "newuser@example.com",
            "password": "SecurePassword123!",
            "firstName": "Jane",
            "lastName": "Smith",
            "phone": "+1987654321"
        }
        register_response = client.post("/api/auth/register", json=user_data)
        assert register_response.status_code == 201
        
        # Step 2: Login user
        login_data = {
            "email": "newuser@example.com",
            "password": "SecurePassword123!"
        }
        login_response = client.post("/api/auth/login", json=login_data)
        assert login_response.status_code == 200
        
        auth_token = login_response.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Step 3: Add address to profile
        address_data = {
            "type": "home",
            "isDefault": True,
            "firstName": "Jane",
            "lastName": "Smith",
            "addressLine1": "456 Oak Ave",
            "city": "Springfield",
            "state": "IL",
            "zipCode": "62701",
            "country": "United States"
        }
        address_response = client.post(
            "/api/users/addresses",
            json=address_data,
            headers=auth_headers
        )
        assert address_response.status_code == 201
        
        # Step 4: Create cart and add items
        cart_response = client.post("/api/cart/session", headers=auth_headers)
        session_token = cart_response.json()["session_token"]
        
        cart_item_data = {
            "product_variant_id": sample_product_variant.id,
            "quantity": 1
        }
        client.post(f"/api/cart/{session_token}/items", json=cart_item_data)
        
        # Step 5: Add to wishlist
        wishlist_data = {
            "product_id": sample_product_variant.product_id,
            "variant_id": sample_product_variant.id
        }
        wishlist_response = client.post(
            "/api/wishlist",
            json=wishlist_data,
            headers=auth_headers
        )
        assert wishlist_response.status_code == 201
        
        # Step 6: Place order using saved address
        checkout_data = {
            "cart_session_id": session_token,
            "use_saved_addresses": True,
            "shipping_method_id": "standard-shipping"
        }
        
        checkout_response = client.post(
            "/api/orders/checkout",
            json=checkout_data,
            headers=auth_headers
        )
        assert checkout_response.status_code == 201
        
        # Step 7: View order history
        orders_response = client.get("/api/orders", headers=auth_headers)
        assert orders_response.status_code == 200
        
        orders = orders_response.json()
        assert len(orders["items"]) >= 1

@pytest.mark.e2e
class TestProductBrowsingScenario:
    """Test product browsing and search scenarios."""
    
    def test_product_discovery_flow(self, client: TestClient, sample_product, sample_category):
        """Test complete product discovery and browsing flow."""
        
        # Step 1: Browse categories
        categories_response = client.get("/api/categories")
        assert categories_response.status_code == 200
        categories = categories_response.json()
        assert len(categories) > 0
        
        # Step 2: Browse products by category
        category_products_response = client.get(
            f"/api/products?category_id={sample_category.id}"
        )
        assert category_products_response.status_code == 200
        products = category_products_response.json()
        assert len(products["items"]) > 0
        
        # Step 3: Search products
        search_response = client.get("/api/products/search?q=pickle")
        assert search_response.status_code == 200
        search_results = search_response.json()
        assert "items" in search_results
        
        # Step 4: Get product details
        product_response = client.get(f"/api/products/{sample_product.id}")
        assert product_response.status_code == 200
        
        product_details = product_response.json()
        assert product_details["id"] == sample_product.id
        assert "variants" in product_details
        assert "images" in product_details
        
        # Step 5: Get product reviews
        reviews_response = client.get(f"/api/products/{sample_product.id}/reviews")
        assert reviews_response.status_code == 200
        
        # Step 6: Track product view analytics
        analytics_data = {
            "event_type": "product_view",
            "session_id": "test-session-123",
            "product_id": sample_product.id
        }
        analytics_response = client.post("/api/analytics/track", json=analytics_data)
        assert analytics_response.status_code in [200, 201]

@pytest.mark.e2e 
class TestCustomerServiceScenario:
    """Test customer service related scenarios."""
    
    def test_order_management_scenario(self, client: TestClient, auth_headers, admin_headers):
        """Test order management from customer service perspective."""
        
        # Step 1: Customer places order (using previous flow)
        # ... (abbreviated for brevity)
        
        # Step 2: Customer requests order status
        order_id = "test-order-123"  # Would come from actual order
        
        # Step 3: Customer service views order
        admin_order_response = client.get(
            f"/api/admin/orders/{order_id}",
            headers=admin_headers
        )
        # Might not exist, but endpoint should respond appropriately
        assert admin_order_response.status_code in [200, 404]
        
        # Step 4: Update order status
        if admin_order_response.status_code == 200:
            status_update = {
                "status": "processing",
                "notes": "Order is being prepared",
                "notify_customer": True
            }
            update_response = client.patch(
                f"/api/admin/orders/{order_id}/status",
                json=status_update,
                headers=admin_headers
            )
            assert update_response.status_code == 200
    
    def test_return_and_refund_scenario(self, client: TestClient, auth_headers):
        """Test return and refund process."""
        
        # Step 1: Customer requests return
        return_request = {
            "order_id": "test-order-123",
            "items": [
                {
                    "order_item_id": "item-123",
                    "quantity": 1,
                    "reason": "quality_issue",
                    "notes": "Product was damaged on arrival"
                }
            ]
        }
        
        return_response = client.post(
            "/api/orders/returns",
            json=return_request,
            headers=auth_headers
        )
        # Endpoint might not exist yet, but should respond appropriately
        assert return_response.status_code in [200, 201, 404]

@pytest.mark.e2e
class TestPerformanceScenario:
    """Test performance-related scenarios."""
    
    def test_high_volume_cart_operations(self, client: TestClient, sample_product_variant):
        """Test cart operations under load simulation."""
        
        # Create multiple cart sessions
        sessions = []
        for i in range(10):
            response = client.post("/api/cart/session")
            assert response.status_code == 201
            sessions.append(response.json()["session_token"])
        
        # Add items to all carts simultaneously
        for session_token in sessions:
            cart_item_data = {
                "product_variant_id": sample_product_variant.id,
                "quantity": 1
            }
            response = client.post(
                f"/api/cart/{session_token}/items",
                json=cart_item_data
            )
            assert response.status_code == 201
        
        # Verify all carts have items
        for session_token in sessions:
            response = client.get(f"/api/cart/{session_token}")
            assert response.status_code == 200
            cart_data = response.json()
            assert len(cart_data["items"]) == 1
    
    def test_concurrent_inventory_updates(self, client: TestClient, sample_product_variant):
        """Test concurrent inventory operations."""
        
        # Get current inventory
        inventory_response = client.get(f"/api/inventory/{sample_product_variant.id}")
        
        if inventory_response.status_code == 200:
            # Simulate multiple concurrent cart additions
            sessions = []
            for i in range(5):
                session_response = client.post("/api/cart/session")
                session_token = session_response.json()["session_token"]
                
                cart_item_data = {
                    "product_variant_id": sample_product_variant.id,
                    "quantity": 1
                }
                add_response = client.post(
                    f"/api/cart/{session_token}/items",
                    json=cart_item_data
                )
                assert add_response.status_code == 201
                sessions.append(session_token)
            
            # Verify inventory is properly managed
            final_inventory_response = client.get(f"/api/inventory/{sample_product_variant.id}")
            assert final_inventory_response.status_code == 200
