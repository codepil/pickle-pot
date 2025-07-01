# The Pickle Pot API

A comprehensive FastAPI-based REST API for The Pickle Pot e-commerce platform featuring traditional pickles and spice powders.

## Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: User registration, profile management, addresses, payment methods
- **Product Catalog**: Categories, products, variants, search, and filtering
- **Shopping Cart**: Session-based cart management for guests and users
- **Order Management**: Complete order lifecycle from creation to delivery
- **Payment Processing**: Stripe integration for secure payments
- **Shipping**: Multiple shipping methods and tracking
- **Reviews & Ratings**: Product reviews and rating system
- **Wishlist**: User wishlist functionality
- **Coupons & Discounts**: Promotional code system
- **Content Management**: Static pages and blog posts
- **Analytics**: User behavior tracking
- **Newsletter**: Email subscription management
- **Admin Panel**: Administrative operations and reporting

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis for session management
- **Authentication**: JWT with python-jose
- **Payment Processing**: Stripe
- **File Storage**: AWS S3 (configurable)
- **Email**: SMTP support
- **Task Queue**: Celery (for background tasks)

## Project Structure

```
picklepot-api/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Multi-service setup
├── .env.example          # Environment variables template
├── core/                 # Core application modules
│   ├── config.py         # Settings and configuration
│   ├── database.py       # Database connection and setup
│   └── auth.py           # Authentication utilities
├── models/               # SQLAlchemy database models
│   └── user.py           # User, Address, PaymentMethod models
├── schemas/              # Pydantic request/response schemas
│   ├── auth.py           # Authentication schemas
│   ├── user.py           # User-related schemas
│   └── common.py         # Common response schemas
└── routers/              # API route handlers
    ├── auth.py           # Authentication endpoints
    ├── users.py          # User management endpoints
    ├── categories.py     # Product categories
    ├── products.py       # Product catalog
    ├── cart.py           # Shopping cart
    ├── orders.py         # Order management
    ├── payments.py       # Payment processing
    ├── shipping.py       # Shipping methods
    ├── reviews.py        # Product reviews
    ├── wishlist.py       # User wishlist
    ├── coupons.py        # Promotional codes
    ├── analytics.py      # Event tracking
    ├── newsletter.py     # Email subscriptions
    ├── content.py        # Static content
    └── admin.py          # Administrative endpoints
```

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository and navigate to the API directory:

```bash
cd picklepot-api
```

2. Copy environment variables and configure:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start all services:

```bash
docker-compose up -d
```

4. The API will be available at `http://localhost:8000`
5. Interactive API documentation at `http://localhost:8000/docs`

### Local Development

1. Install Python 3.11+ and create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL and Redis locally, then configure `.env`

4. Run database migrations:

```bash
# This will create tables automatically when the app starts
```

5. Start the development server:

```bash
uvicorn main:app --reload --reload-exclude venv --host 0.0.0.0 --port 8000
```

Downgrade your Python version to 3.12 or lower to use SQLAlchemy and avoid this errors if any
```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## API Documentation

http://localhost:8000/docs#

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

- **Authentication**: `/auth/register`, `/auth/login`, `/auth/logout`
- **User Profile**: `/users/profile`, `/users/addresses`, `/users/payment-methods`
- **Products**: `/products`, `/products/{id}`, `/categories`
- **Shopping**: `/cart`, `/cart/items`, `/orders`
- **Admin**: `/admin/products`, `/admin/orders`, `/admin/inventory`

### API Base URLs

- **Development**: `http://localhost:8000`
- **Production**: `https://api.thepicklepot.com/v1`

## Configuration

Key environment variables:

```bash
# Security
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://user:password@localhost/picklepot

# Stripe
STRIPE_SECRET_KEY=sk_test_or_live_...
STRIPE_PUBLIC_KEY=pk_test_or_live_...

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
```

## Development

## 🧪 Testing Framework

The Pickle Pot API includes a comprehensive testing framework built with **pytest** to ensure code quality, reliability, and maintainability.

### Testing Architecture

Our testing strategy follows three distinct layers:

#### 🔧 Unit Tests (`@pytest.mark.unit`)

- **Purpose**: Test individual components in isolation
- **Speed**: Fast execution (< 1 second per test)
- **Coverage**: Models, schemas, business logic, utility functions
- **Dependencies**: Mock external services and database calls

```bash
# Run unit tests only
python picklepot-api/run_tests.py --unit
```

**What we test:**

- SQLAlchemy model validation and constraints
- Pydantic schema validation and field constraints
- Business logic calculations (pricing, tax, shipping)
- Data transformation utilities
- Enum validations and type safety

#### 🔗 Integration Tests (`@pytest.mark.integration`)

- **Purpose**: Test API endpoints and database interactions
- **Coverage**: HTTP request/response cycles, database operations
- **Database**: Uses isolated test database with automatic cleanup
- **Authentication**: Tests protected endpoints with mock auth headers

```bash
# Run integration tests only
python picklepot-api/run_tests.py --integration
```

**What we test:**

- API endpoint functionality and HTTP status codes
- Database CRUD operations with real transactions
- Request/response schema validation
- Authentication and authorization flows
- Error handling and edge cases

#### 🎭 End-to-End Tests (`@pytest.mark.e2e`)

- **Purpose**: Test complete user scenarios and business workflows
- **Coverage**: Multi-step processes that span multiple API calls
- **Scope**: Real-world user journeys from start to finish

```bash
# Run end-to-end tests only
python picklepot-api/run_tests.py --e2e
```

**User scenarios tested:**

- **Complete Guest Order Flow**: Cart creation → Add products → Apply coupons → Checkout → Payment processing → Order confirmation
- **User Registration Journey**: Account creation → Email verification → Profile setup → Address management → First order
- **Product Discovery Flow**: Category browsing → Search → Product details → Add to cart → Wishlist management
- **Admin Management Scenarios**: Order status updates → Inventory management → Customer service operations

### Test Configuration

#### Prerequisites

```bash
# Install test dependencies
cd picklepot-api
pip install -r requirements-test.txt
```

#### Running Tests

```bash
# Run all tests with coverage
python run_tests.py --all --coverage

# Run tests in parallel (faster execution)
python run_tests.py --all --parallel 4

# Run with verbose output
python run_tests.py --all --verbose

# Run specific test categories
python run_tests.py --unit --integration  # Skip e2e tests
```

#### Test Database

- **Engine**: SQLite for isolated testing
- **Lifecycle**: Fresh database created/destroyed per test function
- **Fixtures**: Pre-populated with sample data (users, products, categories)
- **Isolation**: No test interference or data leakage

### Test Structure

```
picklepot-api/tests/
├── conftest.py                 # Test configuration and fixtures
├── utils.py                    # Test utilities and data generators
├── test_product_unit.py        # Product model and schema tests
├── test_cart_unit.py           # Cart functionality tests
├── test_cart_integration.py    # Cart API endpoint tests
├── test_user_scenarios.py      # Complete user workflow tests
├── run_tests.py                # Test runner script
└── README.md                   # Testing documentation
```

### Test Data Management

#### Fixtures

- **sample_user**: Test user with authentication
- **sample_product**: Product with variants and pricing
- **sample_category**: Product category hierarchy
- **sample_cart_session**: Shopping cart with expiration
- **auth_headers**: Authentication headers for protected endpoints
- **admin_headers**: Admin-level access for management endpoints

#### Data Generation

```python
from tests.utils import TestDataGenerator

# Generate realistic test data
user_data = TestDataGenerator.generate_user_data()
product_data = TestDataGenerator.generate_product_data(category_id)
order_data = TestDataGenerator.generate_order_data()
```

### Functional Testing Examples

#### Unit Test Example

```python
@pytest.mark.unit
def test_cart_total_calculation(db_session, sample_cart_session):
    """Test cart total calculation with tax and shipping."""
    cart_item = CartItem(
        cart_session_id=sample_cart_session.id,
        product_variant_id=variant.id,
        quantity=2
    )

    expected_subtotal = cart_item.quantity * variant.price
    assert calculate_cart_subtotal(cart_item) == expected_subtotal
```

#### Integration Test Example

```python
@pytest.mark.integration
def test_add_to_cart_endpoint(client, sample_product_variant):
    """Test adding product to cart via API."""
    session_response = client.post("/api/cart/session")
    session_token = session_response.json()["session_token"]

    response = client.post(f"/api/cart/{session_token}/items", json={
        "product_variant_id": sample_product_variant.id,
        "quantity": 2
    })

    assert response.status_code == 201
    assert response.json()["quantity"] == 2
```

#### E2E Test Example

```python
@pytest.mark.e2e
def test_complete_order_flow(client, sample_product_variant):
    """Test complete guest checkout flow."""
    # Step 1: Create cart session
    cart_response = client.post("/api/cart/session")
    session_token = cart_response.json()["session_token"]

    # Step 2: Add products to cart
    client.post(f"/api/cart/{session_token}/items", json={
        "product_variant_id": sample_product_variant.id,
        "quantity": 2
    })

    # Step 3: Apply promotional code
    client.post(f"/api/cart/{session_token}/apply-coupon", json={
        "code": "WELCOME10"
    })

    # Step 4: Calculate shipping rates
    shipping_response = client.post(f"/api/cart/{session_token}/shipping-rates")

    # Step 5: Proceed to checkout
    checkout_response = client.post("/api/orders/checkout", json={
        "cart_session_id": session_token,
        # ... complete checkout data
    })

    # Step 6: Process payment
    payment_response = client.post("/api/payments/process")

    # Verify complete order was created
    assert checkout_response.status_code == 201
    assert payment_response.status_code == 200
```

### Coverage and Quality Metrics

#### Coverage Targets

- **Unit Tests**: >95% code coverage for models and business logic
- **Integration Tests**: >90% API endpoint coverage
- **E2E Tests**: 100% critical user journey coverage

#### Quality Assurance

- **Type Safety**: Full TypeScript/Python type checking
- **Schema Validation**: Request/response schema enforcement
- **Error Handling**: Comprehensive error scenario testing
- **Performance**: Load testing for high-traffic scenarios

### Continuous Integration

Tests are designed for CI/CD integration:

```yaml
# GitHub Actions example
- name: Run API Tests
  run: |
    cd picklepot-api
    pip install -r requirements-test.txt
    python run_tests.py --all --coverage --parallel 4

- name: Upload Coverage Reports
  uses: codecov/codecov-action@v1
  with:
    file: ./picklepot-api/coverage.xml
```

### Test-Driven Development

Our development workflow emphasizes TDD:

1. **Red**: Write failing test for new feature
2. **Green**: Implement minimal code to pass test
3. **Refactor**: Improve code while keeping tests green
4. **Repeat**: Continue cycle for robust, tested code

This comprehensive testing framework ensures The Pickle Pot API maintains high quality, reliability, and user satisfaction across all features and user scenarios.

### Database Migrations

This project uses SQLAlchemy models with automatic table creation. For production, consider using Alembic for migrations:

```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Adding New Endpoints

1. Create Pydantic schemas in `schemas/`
2. Define database models in `models/`
3. Implement route handlers in `routers/`
4. Register router in `main.py`

## Production Deployment

### Using Docker

1. Build and push your Docker image
2. Set up PostgreSQL and Redis instances
3. Configure environment variables
4. Deploy with your preferred orchestration tool

### Environment Setup

- Use strong `SECRET_KEY` for JWT tokens
- Configure SSL/TLS for database connections
- Set up proper logging and monitoring
- Configure backup strategies for PostgreSQL
- Use Redis persistence for session data

## API Specification

This API implements the complete OpenAPI 3.0 specification defined in `openapi-spec.json`. The current implementation includes placeholder responses for rapid prototyping. To fully implement:

1. Replace placeholder implementations with actual business logic
2. Implement proper database models for all entities
3. Add comprehensive error handling
4. Implement proper pagination
5. Add input validation and sanitization
6. Set up proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
