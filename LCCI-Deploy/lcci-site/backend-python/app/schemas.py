from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Admin Schemas
class AdminUserBase(BaseModel):
    username: str
    email: EmailStr

class AdminUserCreate(AdminUserBase):
    password: str

class AdminUserLogin(BaseModel):
    username: str
    password: str

class AdminUser(AdminUserBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Hero Section Schemas
class HeroSectionUpdate(BaseModel):
    title: str
    titleUr: Optional[str] = ""
    subtitle: str
    subtitleUr: Optional[str] = ""
    imageUrl: str
    btn1Text: str
    btn1TextUr: Optional[str] = ""
    btn2Text: str
    btn2TextUr: Optional[str] = ""
    btn1Enabled: bool = True
    btn2Enabled: bool = True
    learnMoreHref: str = "/about"
    memberHref: str = "/contact"

class HeroSection(HeroSectionUpdate):
    id: str
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Site Settings Schemas
class SiteSettingsUpdate(BaseModel):
    primaryColor: Optional[str] = "#0B6E4F"
    secondaryColor: Optional[str] = "#0A2A43"
    accentColor: Optional[str] = "#FFD166"
    backgroundColor: Optional[str] = "#F5F7FA"
    logoUrl: Optional[str] = ""
    topBarPhone: Optional[str] = "+92-XXX-XXXXXXX"
    topBarEmail: Optional[EmailStr] = "info@lcci.org.pk"
    facebookUrl: Optional[str] = ""
    twitterUrl: Optional[str] = ""
    linkedinUrl: Optional[str] = ""
    youtubeUrl: Optional[str] = ""
    footerText: Optional[str] = "© Layyah Chamber of Commerce & Industry"
    address: Optional[str] = "Layyah, Punjab, Pakistan"
    mapEmbedUrl: Optional[str] = ""
    metaTitle: Optional[str] = "LCCI – Layyah Chamber of Commerce & Industry"
    metaDescription: Optional[str] = "Supporting local businesses in Layyah."
    metaKeywords: Optional[str] = "LCCI, Layyah, Chamber of Commerce"
    ogImageUrl: Optional[str] = ""

class SiteSettings(SiteSettingsUpdate):
    id: str
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Service Schemas
class ServiceBase(BaseModel):
    title: str
    slug: str
    description: str
    titleUr: Optional[str] = ""
    descriptionUr: Optional[str] = ""
    icon: Optional[str] = "briefcase"
    active: Optional[bool] = True
    showOnHome: Optional[bool] = False
    homeOrder: Optional[int] = 0

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    titleUr: Optional[str] = None
    descriptionUr: Optional[str] = None
    icon: Optional[str] = None
    active: Optional[bool] = None
    showOnHome: Optional[bool] = None
    homeOrder: Optional[int] = None

class Service(ServiceBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Activity Schemas
class ActivityBase(BaseModel):
    title: str
    slug: str
    description: str
    titleUr: Optional[str] = ""
    descriptionUr: Optional[str] = ""
    imageUrl: Optional[str] = ""
    date: datetime
    showOnHome: Optional[bool] = True

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    titleUr: Optional[str] = None
    descriptionUr: Optional[str] = None
    imageUrl: Optional[str] = None
    date: Optional[datetime] = None
    showOnHome: Optional[bool] = None

class Activity(ActivityBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Event Schemas
class EventGalleryBase(BaseModel):
    imageUrl: str
    sortOrder: Optional[int] = 0

class EventGalleryCreate(EventGalleryBase):
    pass

class EventGallery(EventGalleryBase):
    id: str
    eventId: str
    
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    description: str
    category: Optional[str] = "General"
    date: datetime
    imageUrl: Optional[str] = ""
    pdfUrl: Optional[str] = ""
    highlighted: Optional[bool] = False
    hidden: Optional[bool] = False

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date: Optional[datetime] = None
    imageUrl: Optional[str] = None
    pdfUrl: Optional[str] = None
    highlighted: Optional[bool] = None
    hidden: Optional[bool] = None

class Event(EventBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    gallery: List[EventGallery] = []
    
    class Config:
        from_attributes = True

# Leadership Schemas
class LeadershipBase(BaseModel):
    name: str
    role: str
    bio: str
    photoUrl: Optional[str] = ""
    sortOrder: Optional[int] = 0

class LeadershipCreate(LeadershipBase):
    pass

class LeadershipUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photoUrl: Optional[str] = None
    sortOrder: Optional[int] = None

class Leadership(LeadershipBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Partner Schemas
class PartnerBase(BaseModel):
    name: str
    logoUrl: str
    websiteUrl: str
    sortOrder: Optional[int] = 0

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logoUrl: Optional[str] = None
    websiteUrl: Optional[str] = None
    sortOrder: Optional[int] = None

class Partner(PartnerBase):
    id: str
    createdAt: datetime
    
    class Config:
        from_attributes = True

# About Content Schemas
class AboutContentUpdate(BaseModel):
    mission: str
    missionUr: Optional[str] = ""
    vision: str
    visionUr: Optional[str] = ""
    history: str
    historyUr: Optional[str] = ""

class AboutContent(AboutContentUpdate):
    id: str
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Membership Application Schemas
class MembershipApplicationBase(BaseModel):
    businessName: str
    ownerName: str
    address: str
    businessType: str
    registrationNo: str
    contactNo: str
    email: EmailStr

class MembershipApplicationCreate(MembershipApplicationBase):
    pass

class MembershipApplicationUpdate(BaseModel):
    status: Optional[str] = None
    remarks: Optional[str] = None

class MembershipApplication(MembershipApplicationBase):
    id: str
    cnicPath: Optional[str] = None
    businessDocsPath: Optional[str] = None
    status: str
    remarks: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Service Request Schemas
class ServiceRequestBase(BaseModel):
    serviceId: str
    name: str
    email: EmailStr
    phone: str
    message: str

class ServiceRequestCreate(ServiceRequestBase):
    pass

class ServiceRequestUpdate(BaseModel):
    status: Optional[str] = None

class ServiceRequest(ServiceRequestBase):
    id: str
    attachmentPath: Optional[str] = None
    status: str
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True

# Why Choose Item Schemas
class WhyChooseItemBase(BaseModel):
    text: str
    textUr: Optional[str] = ""
    sortOrder: Optional[int] = 0

class WhyChooseItemCreate(WhyChooseItemBase):
    pass

class WhyChooseItemUpdate(BaseModel):
    text: Optional[str] = None
    textUr: Optional[str] = None
    sortOrder: Optional[int] = None

class WhyChooseItem(WhyChooseItemBase):
    id: str
    
    class Config:
        from_attributes = True

# Activity Log Schemas
class ActivityLogBase(BaseModel):
    action: str
    entity: str
    details: Optional[str] = ""
    ip: Optional[str] = None

class ActivityLog(ActivityLogBase):
    id: str
    adminId: Optional[str] = None
    createdAt: datetime
    
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    admin_id: Optional[str] = None
