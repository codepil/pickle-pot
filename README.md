# The Pickle Pot 🫙

A modern e-commerce platform for authentic Indian pickles and spice powders, built with React and TypeScript.

## About

The Pickle Pot celebrates traditional Indian culinary heritage by offering premium pickles and artisanal spice powders. Our platform provides a seamless shopping experience with features like user authentication, shopping cart management, and comprehensive product catalogs.

## ✨ Features

### Core E-commerce Functionality

- **Product Catalogs**: Browse 8 varieties of pickles and 10 spice powder blends
- **Shopping Cart**: Add items with size selection, quantity control, and delivery date picker
- **User Authentication**: Secure login/signup with persistent sessions
- **Account Management**: Comprehensive user profiles with preferences and settings

### Advanced Features

- **Address Management**: Multiple shipping addresses with default settings
- **Payment Methods**: Support for multiple payment methods and cards
- **Promotional Codes**: Dynamic discount system (PICKLE25, WELCOME10, FREESHIP)
- **Search & Filter**: Product discovery with category and spice level filtering
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Content Pages

- **Our Story**: Heritage and traditional values showcase
- **FAQ**: Interactive help center with search functionality
- **Contact**: Business information and contact forms
- **Legal Pages**: Privacy policy and terms & conditions

## 🛠 Technology Stack

### Frontend

- **React 18** with TypeScript for type-safe development
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations
- **React Hook Form** for form management and validation

### Backend & Build Tools

- **Vite** for fast development and building
- **Express.js** for server-side functionality
- **Zod** for runtime type validation
- **SWC** for fast TypeScript compilation

### State Management

- **React Context** for global state (Cart & User)
- **localStorage** for data persistence
- **React Query** for server state management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd the-pickle-pot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to the URL shown in your terminal (typically `http://localhost:5173`)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (client + server)
- `npm run build:client` - Build client-side application
- `npm run build:server` - Build server-side application
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run typecheck` - Type check TypeScript files
- `npm run format.fix` - Format code with Prettier

## 📁 Project Structure

```
code/
├── client/                 # Frontend application
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Main navigation header
│   │   └── AddToCartDialog.tsx # Shopping cart modal
│   ├── context/           # Global state management
│   │   ├── CartContext.tsx # Shopping cart state
│   │   └── UserContext.tsx # User authentication state
│   ├── pages/             # Application pages/routes
│   │   ├── Index.tsx      # Homepage with featured products
│   │   ├── Pickles.tsx    # Pickles product catalog
│   │   ├── Powders.tsx    # Spice powders catalog
│   │   ├── Cart.tsx       # Shopping cart and checkout
│   │   ├── Auth.tsx       # Login/signup forms
│   │   ├── Account.tsx    # User profile management
│   │   ├── Contact.tsx    # Contact information
│   │   ├── OurStory.tsx   # Brand story and heritage
│   │   ├── FAQ.tsx        # Frequently asked questions
│   │   ├── PrivacyPolicy.tsx # Privacy policy
│   │   └── TermsConditions.tsx # Terms and conditions
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and helpers
│   ├── global.css         # Global styles and CSS variables
│   └── main.tsx           # Application entry point
├── server/                # Backend server code
├── shared/                # Shared utilities between client/server
├── public/                # Static assets
├── dist/                  # Build output directory
└── package.json           # Project dependencies and scripts
```

## 🎨 Design System

### Color Palette

The application uses a spice-inspired color scheme:

- **Turmeric**: Warm yellows (#F59E0B, #FEF3C7)
- **Paprika**: Rich reds (#DC2626, #FEE2E2)
- **Cumin**: Earthy browns (#92400E, #FED7AA)
- **Cardamom**: Soft greens (#059669, #D1FAE5)

### Typography

- **Primary Font**: Inter (clean, modern sans-serif)
- **Accent Font**: Custom font stack for headings

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict type checking enabled
- **Prettier**: Automatic code formatting
- **ESLint**: Code quality and consistency
- **Semantic HTML**: Accessible markup patterns

### Component Architecture

- **Atomic Design**: Components broken into meaningful abstractions
- **Context Providers**: Global state management
- **Custom Hooks**: Reusable logic extraction
- **Type Safety**: Comprehensive TypeScript coverage

### State Management

- **Local State**: useState for component-specific state
- **Global State**: Context API for cart and user data
- **Persistence**: localStorage for cross-session data
- **Server State**: React Query for API data management

## 🌟 Key Features Deep Dive

### Shopping Cart

- Persistent cart state across browser sessions
- Dynamic quantity and size selection
- Delivery date picker (2-30 days)
- Promotional code system with validation
- Real-time price calculations with tax and shipping

### User Authentication

- Secure login/signup with validation
- Profile management with preferences
- Multiple address and payment method support
- Privacy and notification settings

### Product Management

- Rich product data with ingredients and descriptions
- Multiple size options (6oz, 8oz bottles)
- Spice level indicators (Mild, Medium, Hot)
- Category-based filtering and search

## 📱 Responsive Design

The application is built mobile-first with responsive breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

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

## 🚀 Deployment

The application is configured for deployment on:

- **Netlify**: Using `netlify.toml` configuration
- **Node.js servers**: Production-ready Express server
- **Serverless platforms**: Serverless HTTP support included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Run `npm run dev` for development
2. Run `npm run typecheck` before committing
3. Run `npm run format.fix` to format code
4. Ensure all tests pass with `npm test`

## 📄 License

This project is private and proprietary.

## 📞 Contact

- **Email**: hello@thepicklepot.com
- **Phone**: +1 408 219 1573
- **Location**: San Jose, CA, USA

---

Built with ❤️ and a passion for authentic Indian flavors.
