from sqlalchemy import Column, String, DateTime, Text, Boolean, JSON, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class Page(Base):
    __tablename__ = "pages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=True)
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)
    template = Column(String(100), default='default')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index('idx_pages_published', is_published),
    )

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    featured_image_url = Column(String(500), nullable=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    category = Column(String(100), nullable=True)
    tags = Column(JSON, nullable=True)
    status = Column(String(20), default='draft')  # draft, published, archived
    published_at = Column(DateTime, nullable=True)
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    author = relationship("User", back_populates="blog_posts")

    __table_args__ = (
        Index('idx_blog_status', status),
        Index('idx_blog_published', published_at),
        Index('idx_blog_category', category),
    )

class Setting(Base):
    __tablename__ = "settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    setting_key = Column(String(100), unique=True, nullable=False, index=True)
    setting_value = Column(Text, nullable=True)
    setting_type = Column(String(20), default='string')  # string, number, boolean, json
    description = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False)  # Whether setting can be accessed from frontend
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index('idx_settings_public', is_public),
    )
