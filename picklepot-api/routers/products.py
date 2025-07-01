from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
import math

from core.database import get_db
from models.product import Product, Category, ProductImage, ProductBadge
from schemas.product import ProductListItem, Product as ProductSchema
from schemas.common import MessageResponse, PaginationResponse

router = APIRouter()

@router.get("/")
async def get_products(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sortBy: Optional[str] = Query("created_at"),
    sortOrder: Optional[str] = Query("desc")
):
    """Get all products with filtering and pagination"""
    query = db.query(Product).filter(Product.status == 'active')

    # Category filter
    if category:
        query = query.filter(Product.category_id == category)

    # Search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.short_description.ilike(search_term)
            )
        )

    # Apply sorting
    if sortBy == "name":
        order_field = Product.name
    elif sortBy == "price":
        order_field = Product.price_6oz
    elif sortBy == "featured":
        order_field = Product.featured
    else:
        order_field = Product.created_at

    if sortOrder.lower() == "asc":
        query = query.order_by(order_field.asc())
    else:
        query = query.order_by(order_field.desc())

    # Count total items
    total = query.count()
    total_pages = math.ceil(total / limit)

    # Apply pagination
    products = query.offset((page - 1) * limit).limit(limit).all()

    # Convert to response format
    product_items = []
    for product in products:
        # Get primary image
        primary_image = None
        for img in product.images:
            if img.is_primary:
                primary_image = img
                break
        if not primary_image and product.images:
            primary_image = product.images[0]

        product_item = ProductListItem(
            id=str(product.id),
            name=product.name,
            slug=product.slug,
            short_description=product.short_description,
            price_6oz=product.price_6oz,
            price_8oz=product.price_8oz,
            compare_price_6oz=product.compare_price_6oz,
            compare_price_8oz=product.compare_price_8oz,
            featured=product.featured,
            status=product.status,
            category=product.category,
            primary_image=primary_image,
            badges=product.badges
        )
        product_items.append(product_item)

    return {
        "products": product_items,
        "pagination": PaginationResponse(
            page=page,
            limit=limit,
            total=total,
            totalPages=total_pages,
            hasNext=page < total_pages,
            hasPrev=page > 1
        )
    }

@router.get("/{productId}", response_model=ProductSchema)
async def get_product(productId: str, db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == productId).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product

@router.get("/{productId}/variants")
async def get_product_variants(productId: str, db: Session = Depends(get_db)):
    """Get product variants"""
    product = db.query(Product).filter(Product.id == productId).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return {"variants": product.variants}

@router.get("/{productId}/reviews")
async def get_product_reviews(
    productId: str,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get product reviews"""
    from models.review import ProductReview
    from sqlalchemy import func

    product = db.query(Product).filter(Product.id == productId).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Count total reviews
    total = db.query(ProductReview).filter(ProductReview.product_id == productId).count()
    total_pages = math.ceil(total / limit)

    # Get reviews with pagination
    reviews = (
        db.query(ProductReview)
        .filter(ProductReview.product_id == productId)
        .order_by(ProductReview.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    # Calculate rating statistics
    rating_stats = (
        db.query(
            func.avg(ProductReview.rating).label('avg_rating'),
            func.count(ProductReview.id).label('total_reviews')
        )
        .filter(ProductReview.product_id == productId)
        .first()
    )

    # Get rating distribution
    rating_distribution = {}
    for i in range(1, 6):
        count = (
            db.query(ProductReview)
            .filter(ProductReview.product_id == productId, ProductReview.rating == i)
            .count()
        )
        rating_distribution[str(i)] = count

    return {
        "reviews": reviews,
        "pagination": PaginationResponse(
            page=page,
            limit=limit,
            total=total,
            totalPages=total_pages,
            hasNext=page < total_pages,
            hasPrev=page > 1
        ),
        "summary": {
            "averageRating": float(rating_stats.avg_rating) if rating_stats.avg_rating else 0,
            "totalReviews": rating_stats.total_reviews,
            "ratingDistribution": rating_distribution
        }
    }
