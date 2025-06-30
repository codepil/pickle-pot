from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from contextlib import asynccontextmanager

from routers import (
    auth, users, categories, products, cart, 
    orders, payments, shipping, reviews, wishlist, 
    coupons, analytics, newsletter, content, admin
)
from core.config import settings
from core.database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    print("Lifespan startup: Tables created successfully.")
    yield
    # Shutdown
    pass


app = FastAPI(
    title="The Pickle Pot E-commerce API",
    description="Comprehensive REST API for The Pickle Pot e-commerce platform featuring traditional pickles and spice powders with full order management, user accounts, inventory tracking, and customer engagement features.",
    version="1.0.0",
    contact={
        "name": "The Pickle Pot",
        "email": "hello@thepicklepot.com",
        "url": "https://thepicklepot.com"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    },
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP_ERROR",
            "message": exc.detail,
            "code": str(exc.status_code)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An internal server error occurred",
            "code": "500"
        }
    )

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(shipping.router, prefix="/shipping", tags=["Shipping"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlist"])
app.include_router(coupons.router, prefix="/coupons", tags=["Coupons"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(newsletter.router, prefix="/newsletter", tags=["Newsletter"])
app.include_router(content.router, prefix="/content", tags=["Content"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/", tags=["Health"])
async def root():
    return {"message": "The Pickle Pot API is running", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "picklepot-api"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
