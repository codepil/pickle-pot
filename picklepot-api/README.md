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
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

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

### Running Tests

```bash
pytest
```

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
