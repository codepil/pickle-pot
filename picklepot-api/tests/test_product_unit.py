import pytest
from decimal import Decimal
from sqlalchemy.exc import IntegrityError
from models.product import Category, Product, ProductVariant, ProductImage, ProductBadge
from schemas.product import (
    CategoryCreate, ProductCreate, ProductVariantCreate,
    ProductImageCreate, ProductBadgeCreate, ProductStatus, BadgeType
)

@pytest.mark.unit
class TestCategoryModel:
    """Unit tests for Category model."""
    
    def test_create_category(self, db_session):
        """Test creating a category."""
        category = Category(
            name="Pickles",
            slug="pickles",
            description="Traditional pickle varieties",
            is_active=True
        )
        db_session.add(category)
        db_session.commit()
        
        assert category.id is not None
        assert category.name == "Pickles"
        assert category.slug == "pickles"
        assert category.is_active is True
        assert category.created_at is not None
    
    def test_category_unique_slug(self, db_session):
        """Test that category slugs must be unique."""
        category1 = Category(name="Pickles", slug="pickles")
        category2 = Category(name="Pickles 2", slug="pickles")
        
        db_session.add(category1)
        db_session.commit()
        
        db_session.add(category2)
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_category_hierarchy(self, db_session):
        """Test category parent-child relationships."""
        parent = Category(name="Condiments", slug="condiments")
        child = Category(name="Pickles", slug="pickles", parent_id=parent.id)
        
        db_session.add(parent)
        db_session.commit()
        
        child.parent_id = parent.id
        db_session.add(child)
        db_session.commit()
        
        assert child.parent_id == parent.id

@pytest.mark.unit
class TestProductModel:
    """Unit tests for Product model."""
    
    def test_create_product(self, db_session, sample_category):
        """Test creating a product."""
        product = Product(
            name="Mango Pickle",
            slug="mango-pickle",
            description="Authentic mango pickle",
            category_id=sample_category.id,
            sku="MANGO-001",
            status="active",
            price_6oz=Decimal('12.99'),
            price_8oz=Decimal('16.99'),
            featured=True
        )
        db_session.add(product)
        db_session.commit()
        
        assert product.id is not None
        assert product.name == "Mango Pickle"
        assert product.sku == "MANGO-001"
        assert product.price_6oz == Decimal('12.99')
        assert product.featured is True
    
    def test_product_unique_sku(self, db_session, sample_category):
        """Test that product SKUs must be unique."""
        product1 = Product(
            name="Pickle 1", slug="pickle-1", category_id=sample_category.id, sku="TEST-001"
        )
        product2 = Product(
            name="Pickle 2", slug="pickle-2", category_id=sample_category.id, sku="TEST-001"
        )
        
        db_session.add(product1)
        db_session.commit()
        
        db_session.add(product2)
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_product_category_relationship(self, db_session, sample_category):
        """Test product-category relationship."""
        product = Product(
            name="Test Product",
            slug="test-product",
            category_id=sample_category.id,
            sku="TEST-001"
        )
        db_session.add(product)
        db_session.commit()
        
        assert product.category.id == sample_category.id
        assert product.category.name == sample_category.name

@pytest.mark.unit
class TestProductVariantModel:
    """Unit tests for ProductVariant model."""
    
    def test_create_variant(self, db_session, sample_product):
        """Test creating a product variant."""
        variant = ProductVariant(
            product_id=sample_product.id,
            name="6oz Bottle",
            sku="TEST-001-6OZ",
            size="6oz",
            price=Decimal('12.99'),
            is_active=True
        )
        db_session.add(variant)
        db_session.commit()
        
        assert variant.id is not None
        assert variant.name == "6oz Bottle"
        assert variant.size == "6oz"
        assert variant.price == Decimal('12.99')
    
    def test_variant_unique_sku(self, db_session, sample_product):
        """Test that variant SKUs must be unique."""
        variant1 = ProductVariant(
            product_id=sample_product.id,
            name="6oz", sku="TEST-001-6OZ", size="6oz", price=Decimal('12.99')
        )
        variant2 = ProductVariant(
            product_id=sample_product.id,
            name="8oz", sku="TEST-001-6OZ", size="8oz", price=Decimal('16.99')
        )
        
        db_session.add(variant1)
        db_session.commit()
        
        db_session.add(variant2)
        with pytest.raises(IntegrityError):
            db_session.commit()

@pytest.mark.unit
class TestProductSchemas:
    """Unit tests for Product schemas."""
    
    def test_category_create_schema(self):
        """Test CategoryCreate schema validation."""
        data = {
            "name": "Pickles",
            "slug": "pickles",
            "description": "Traditional pickles",
            "is_active": True
        }
        schema = CategoryCreate(**data)
        
        assert schema.name == "Pickles"
        assert schema.slug == "pickles"
        assert schema.is_active is True
    
    def test_product_create_schema(self):
        """Test ProductCreate schema validation."""
        data = {
            "name": "Mango Pickle",
            "slug": "mango-pickle",
            "category_id": "test-category-id",
            "sku": "MANGO-001",
            "status": ProductStatus.active,
            "price_6oz": Decimal('12.99'),
            "price_8oz": Decimal('16.99')
        }
        schema = ProductCreate(**data)
        
        assert schema.name == "Mango Pickle"
        assert schema.status == ProductStatus.active
        assert schema.price_6oz == Decimal('12.99')
    
    def test_product_status_enum(self):
        """Test ProductStatus enum validation."""
        valid_statuses = ["active", "inactive", "discontinued"]
        
        for status in valid_statuses:
            schema = ProductCreate(
                name="Test", slug="test", category_id="cat-id",
                sku="TEST-001", status=status
            )
            assert schema.status == status
    
    def test_badge_type_enum(self):
        """Test BadgeType enum validation."""
        badge_data = {
            "badge_type": BadgeType.best_seller,
            "label": "Best Seller",
            "color": "#ff0000"
        }
        schema = ProductBadgeCreate(**badge_data)
        
        assert schema.badge_type == BadgeType.best_seller
        assert schema.label == "Best Seller"
    
    def test_invalid_price_validation(self):
        """Test that negative prices are rejected."""
        with pytest.raises(ValueError):
            ProductCreate(
                name="Test", slug="test", category_id="cat-id",
                sku="TEST-001", price_6oz=Decimal('-1.00')
            )
    
    def test_product_variant_schema(self):
        """Test ProductVariantCreate schema."""
        data = {
            "name": "6oz Bottle",
            "sku": "TEST-001-6OZ",
            "size": "6oz",
            "price": Decimal('12.99'),
            "weight": Decimal('0.375'),  # 6oz in pounds
            "track_inventory": True
        }
        schema = ProductVariantCreate(**data)
        
        assert schema.name == "6oz Bottle"
        assert schema.size == "6oz"
        assert schema.price == Decimal('12.99')
        assert schema.track_inventory is True

@pytest.mark.unit 
class TestProductImageModel:
    """Unit tests for ProductImage model."""
    
    def test_create_product_image(self, db_session, sample_product):
        """Test creating a product image."""
        image = ProductImage(
            product_id=sample_product.id,
            image_url="https://example.com/image.jpg",
            alt_text="Product image",
            is_primary=True
        )
        db_session.add(image)
        db_session.commit()
        
        assert image.id is not None
        assert image.image_url == "https://example.com/image.jpg"
        assert image.is_primary is True

@pytest.mark.unit
class TestProductBadgeModel:
    """Unit tests for ProductBadge model."""
    
    def test_create_product_badge(self, db_session, sample_product):
        """Test creating a product badge."""
        badge = ProductBadge(
            product_id=sample_product.id,
            badge_type="best_seller",
            label="Best Seller",
            color="#ff6b35",
            is_active=True
        )
        db_session.add(badge)
        db_session.commit()
        
        assert badge.id is not None
        assert badge.badge_type == "best_seller"
        assert badge.label == "Best Seller"
        assert badge.is_active is True
