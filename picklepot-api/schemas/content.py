from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class BlogStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

class SettingType(str, Enum):
    string = "string"
    number = "number"
    boolean = "boolean"
    json = "json"

# Page schemas
class PageBase(BaseModel):
    title: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=255)
    content: Optional[str] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    is_published: bool = True
    template: str = Field("default", max_length=100)

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    is_published: Optional[bool] = None
    template: Optional[str] = Field(None, max_length=100)

class Page(PageBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PageListItem(BaseModel):
    id: str
    title: str
    slug: str
    is_published: bool
    template: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Blog Post schemas
class BlogPostBase(BaseModel):
    title: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=255)
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image_url: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    status: BlogStatus = BlogStatus.draft
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    author_id: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image_url: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    status: Optional[BlogStatus] = None
    published_at: Optional[datetime] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None

class BlogPost(BlogPostBase):
    id: str
    author_id: Optional[str] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BlogPostListItem(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: Optional[str] = None
    featured_image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: BlogStatus
    published_at: Optional[datetime] = None
    created_at: datetime
    author_name: Optional[str] = None

    class Config:
        from_attributes = True

# Setting schemas
class SettingBase(BaseModel):
    setting_key: str = Field(..., max_length=100)
    setting_value: Optional[str] = None
    setting_type: SettingType = SettingType.string
    description: Optional[str] = None
    is_public: bool = False

class SettingCreate(SettingBase):
    pass

class SettingUpdate(BaseModel):
    setting_value: Optional[str] = None
    setting_type: Optional[SettingType] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

class Setting(SettingBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PublicSetting(BaseModel):
    setting_key: str
    setting_value: Optional[str] = None
    setting_type: SettingType

    class Config:
        from_attributes = True

# Content search
class ContentSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=255)
    content_type: Optional[str] = Field(None, pattern="^(page|blog|all)$")
    published_only: bool = True

class ContentSearchResult(BaseModel):
    id: str
    title: str
    slug: str
    content_type: str  # "page" or "blog"
    excerpt: Optional[str] = None
    url: str
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ContentSearchResponse(BaseModel):
    results: List[ContentSearchResult]
    total_count: int
    query: str

    class Config:
        from_attributes = True

# Blog filters
class BlogFilters(BaseModel):
    status: Optional[BlogStatus] = None
    category: Optional[str] = None
    author_id: Optional[str] = None
    tag: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None

# Content analytics
class ContentAnalytics(BaseModel):
    total_pages: int
    published_pages: int
    total_blog_posts: int
    published_blog_posts: int
    most_viewed_pages: List[Dict[str, Any]]
    most_viewed_blog_posts: List[Dict[str, Any]]
    content_engagement: Dict[str, float]

    class Config:
        from_attributes = True

# SEO data
class SEOData(BaseModel):
    page_id: str
    title: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    canonical_url: str
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None

    class Config:
        from_attributes = True
