# The Pickle Pot API Testing Guide

This directory contains comprehensive tests for The Pickle Pot e-commerce API, covering unit tests, integration tests, and end-to-end user scenarios.

## Testing Framework

We use **pytest** as our primary testing framework, along with several plugins for enhanced functionality:

- **pytest**: Core testing framework
- **pytest-asyncio**: For testing async FastAPI endpoints
- **httpx**: HTTP client for API testing
- **pytest-cov**: Test coverage reporting
- **factory-boy**: Test data generation
- **faker**: Realistic fake data generation

## Test Structure

### Test Categories

Our tests are organized into three main categories using pytest markers:

#### 🔧 Unit Tests (`@pytest.mark.unit`)

- Test individual components in isolation
- Fast execution (< 1 second per test)
- Mock external dependencies
- Focus on business logic and data validation

**Examples:**

- Model validation and constraints
- Schema validation (Pydantic)
- Utility functions
- Business logic calculations

#### 🔗 Integration Tests (`@pytest.mark.integration`)

- Test API endpoints and database interactions
- Use real database (test database)
- Test request/response cycles
- Verify proper HTTP status codes and responses

**Examples:**

- API endpoint functionality
- Database CRUD operations
- Authentication and authorization
- Error handling

#### 🎭 End-to-End Tests (`@pytest.mark.e2e`)

- Test complete user scenarios and workflows
- Test multiple API calls in sequence
- Verify business processes work end-to-end
- Longer running tests

**Examples:**

- Complete order placement flow
- User registration and profile management
- Product browsing and search
- Cart management workflows

## Running Tests

### Quick Start

```bash
# Install test dependencies
pip install -r requirements-test.txt

# Run all tests
python run_tests.py --all

# Run with coverage
python run_tests.py --all --coverage
```

### Test Categories

```bash
# Run only unit tests (fast)
python run_tests.py --unit

# Run only integration tests
python run_tests.py --integration

# Run only end-to-end tests
python run_tests.py --e2e

# Run unit and integration tests (default)
python run_tests.py
```

### Advanced Options

```bash
# Run tests in parallel (faster)
python run_tests.py --all --parallel 4

# Include slow running tests
python run_tests.py --all --slow

# Verbose output
python run_tests.py --all --verbose

# Run specific test file
pytest tests/test_product_unit.py

# Run specific test method
pytest tests/test_cart_unit.py::TestCartSessionModel::test_create_cart_session

# Run tests matching pattern
pytest -k "test_cart"
```

### Coverage Reports

```bash
# Generate HTML coverage report
python run_tests.py --all --coverage

# View coverage report
open htmlcov/index.html
```

## Test Files

### Unit Tests

- `test_product_unit.py` - Product model and schema validation
- `test_cart_unit.py` - Cart functionality and business logic
- `test_order_unit.py` - Order processing logic
- `test_payment_unit.py` - Payment processing
- `test_inventory_unit.py` - Inventory management
- `test_user_unit.py` - User management and authentication

### Integration Tests

- `test_cart_integration.py` - Cart API endpoints
- `test_product_integration.py` - Product API endpoints
- `test_order_integration.py` - Order API endpoints
- `test_auth_integration.py` - Authentication endpoints
- `test_admin_integration.py` - Admin API endpoints

### End-to-End Tests

- `test_user_scenarios.py` - Complete user workflows
- `test_order_scenarios.py` - Order placement scenarios
- `test_admin_scenarios.py` - Admin management scenarios

## Test Configuration

### Database Setup

Tests use an isolated SQLite database that is created and destroyed for each test function:

```python
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
```

### Fixtures

Common test fixtures are defined in `conftest.py`:

- `client` - FastAPI test client
- `db_session` - Database session
- `sample_user` - Test user
- `sample_product` - Test product
- `sample_category` - Test category
- `auth_headers` - Authentication headers
- `admin_headers` - Admin authentication headers

### Test Data Generation

Use the `TestDataGenerator` class from `tests/utils.py` for creating realistic test data:

```python
from tests.utils import TestDataGenerator

# Generate test user data
user_data = {
    "email": TestDataGenerator.generate_email(),
    "phone": TestDataGenerator.generate_phone(),
    "address": TestDataGenerator.generate_address()
}

# Generate test product data
product_data = TestDataGenerator.generate_product_data(category_id)
```

## Writing Tests

### Unit Test Example

```python
@pytest.mark.unit
class TestProductModel:
    def test_create_product(self, db_session, sample_category):
        """Test creating a product."""
        product = Product(
            name="Mango Pickle",
            slug="mango-pickle",
            category_id=sample_category.id,
            sku="MANGO-001",
            price_6oz=Decimal('12.99')
        )
        db_session.add(product)
        db_session.commit()

        assert product.id is not None
        assert product.name == "Mango Pickle"
        assert product.price_6oz == Decimal('12.99')
```

### Integration Test Example

```python
@pytest.mark.integration
class TestProductAPI:
    def test_create_product_endpoint(self, client, admin_headers):
        """Test creating a product via API."""
        product_data = {
            "name": "Test Pickle",
            "slug": "test-pickle",
            "category_id": "cat-123",
            "sku": "TEST-001",
            "price_6oz": 12.99
        }

        response = client.post(
            "/api/products",
            json=product_data,
            headers=admin_headers
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Pickle"
```

### E2E Test Example

```python
@pytest.mark.e2e
class TestOrderFlow:
    def test_complete_order_flow(self, client, sample_product_variant):
        """Test complete order placement flow."""
        # Step 1: Create cart
        cart_response = client.post("/api/cart/session")
        session_token = cart_response.json()["session_token"]

        # Step 2: Add items
        client.post(f"/api/cart/{session_token}/items", json={
            "product_variant_id": sample_product_variant.id,
            "quantity": 2
        })

        # Step 3: Checkout
        checkout_response = client.post("/api/orders/checkout", json={
            "cart_session_id": session_token,
            # ... other checkout data
        })

        assert checkout_response.status_code == 201
```

## Best Practices

### Test Organization

1. **Group related tests** in classes
2. **Use descriptive test names** that explain what is being tested
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** - each test should be able to run in isolation

### Test Data

1. **Use fixtures** for common test setup
2. **Generate realistic data** using Faker or TestDataGenerator
3. **Clean up after tests** - use function-scoped fixtures
4. **Avoid hardcoded values** that might break in different environments

### Assertions

1. **Use specific assertions** from `tests/utils.py`
2. **Test both happy path and error cases**
3. **Verify response schemas** with helper functions
4. **Check business logic constraints**

### Performance

1. **Keep unit tests fast** (< 1 second each)
2. **Mark slow tests** with `@pytest.mark.slow`
3. **Use parallel execution** for faster test runs
4. **Mock external services** in unit tests

## Continuous Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    pip install -r requirements-test.txt
    python run_tests.py --all --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v1
  with:
    file: ./coverage.xml
```

## Debugging Tests

### Running Individual Tests

```bash
# Run specific test with verbose output
pytest tests/test_cart_unit.py::TestCartModel::test_create_cart -v

# Run with debugger
pytest tests/test_cart_unit.py::TestCartModel::test_create_cart --pdb

# Run with print statements
pytest tests/test_cart_unit.py::TestCartModel::test_create_cart -s
```

### Database Debugging

```bash
# Keep test database after failure
pytest tests/test_cart_unit.py --tb=short --maxfail=1
```

### Coverage Analysis

```bash
# See which lines are not covered
python run_tests.py --unit --coverage
open htmlcov/index.html
```

## Adding New Tests

When adding new functionality:

1. **Start with unit tests** for the core logic
2. **Add integration tests** for API endpoints
3. **Create E2E tests** for user scenarios
4. **Update fixtures** if new test data is needed
5. **Run the full test suite** to ensure no regressions

## Troubleshooting

### Common Issues

**Database connection errors:**

- Check that test database is properly configured
- Ensure all database fixtures are properly scoped

**Import errors:**

- Verify PYTHONPATH includes the project root
- Check that all dependencies are installed

**Slow test execution:**

- Use `--parallel` flag for faster execution
- Mark slow tests appropriately
- Consider mocking expensive operations

**Test isolation issues:**

- Ensure database is cleaned between tests
- Check that fixtures are properly scoped
- Avoid global state in tests

For more help, see the main project documentation or reach out to the development team.
