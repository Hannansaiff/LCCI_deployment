from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class AdminUser(Base):
    __tablename__ = "AdminUser"
    
    id = Column(String(36), primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    passwordHash = Column(String(255), nullable=False)
    resetToken = Column(String(255), nullable=True)
    resetExpiry = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())
    activityLogs = relationship("ActivityLog", back_populates="admin")

class HeroSection(Base):
    __tablename__ = "HeroSection"
    
    id = Column(String(36), primary_key=True, default="singleton")
    title = Column(String(255), nullable=False)
    titleUr = Column(String(255), default="")
    subtitle = Column(String(255), nullable=False)
    subtitleUr = Column(String(255), default="")
    imageUrl = Column(String(500), nullable=False)
    btn1Text = Column(String(100), nullable=False)
    btn1TextUr = Column(String(100), default="")
    btn2Text = Column(String(100), nullable=False)
    btn2TextUr = Column(String(100), default="")
    btn1Enabled = Column(Boolean, default=True)
    btn2Enabled = Column(Boolean, default=True)
    learnMoreHref = Column(String(255), default="/about")
    memberHref = Column(String(255), default="/contact")
    updatedAt = Column(DateTime, onupdate=func.now())

class SiteSettings(Base):
    __tablename__ = "SiteSettings"
    
    id = Column(String(36), primary_key=True, default="singleton")
    primaryColor = Column(String(50), default="#0B6E4F")
    secondaryColor = Column(String(50), default="#0A2A43")
    accentColor = Column(String(50), default="#FFD166")
    backgroundColor = Column(String(50), default="#F5F7FA")
    logoUrl = Column(String(500), default="")
    topBarPhone = Column(String(50), default="+92-XXX-XXXXXXX")
    topBarEmail = Column(String(100), default="info@lcci.org.pk")
    facebookUrl = Column(String(255), default="")
    twitterUrl = Column(String(255), default="")
    linkedinUrl = Column(String(255), default="")
    youtubeUrl = Column(String(255), default="")
    footerText = Column(String(255), default="© Layyah Chamber of Commerce & Industry")
    address = Column(String(500), default="Layyah, Punjab, Pakistan")
    mapEmbedUrl = Column(String(500), default="")
    metaTitle = Column(String(255), default="LCCI – Layyah Chamber of Commerce & Industry")
    metaDescription = Column(String(500), default="Supporting local businesses in Layyah.")
    metaKeywords = Column(String(500), default="LCCI, Layyah, Chamber of Commerce")
    ogImageUrl = Column(String(500), default="")
    updatedAt = Column(DateTime, onupdate=func.now())

class Service(Base):
    __tablename__ = "Service"
    
    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    titleUr = Column(String(255), default="")
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    descriptionUr = Column(Text, default="")
    icon = Column(String(100), default="briefcase")
    active = Column(Boolean, default=True)
    showOnHome = Column(Boolean, default=False)
    homeOrder = Column(Integer, default=0)
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())
    requests = relationship("ServiceRequest", back_populates="service")

class Activity(Base):
    __tablename__ = "Activity"
    
    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    titleUr = Column(String(255), default="")
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    descriptionUr = Column(Text, default="")
    imageUrl = Column(String(500), default="")
    date = Column(DateTime, nullable=False)
    showOnHome = Column(Boolean, default=True)
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())

class Event(Base):
    __tablename__ = "Event"
    
    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    excerpt = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="General")
    date = Column(DateTime, nullable=False)
    imageUrl = Column(String(500), default="")
    pdfUrl = Column(String(500), default="")
    highlighted = Column(Boolean, default=False)
    hidden = Column(Boolean, default=False)
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())
    gallery = relationship("EventGallery", back_populates="event")

class EventGallery(Base):
    __tablename__ = "EventGallery"
    
    id = Column(String(36), primary_key=True)
    eventId = Column(String(36), ForeignKey("Event.id", ondelete="CASCADE"), nullable=False)
    imageUrl = Column(String(500), nullable=False)
    sortOrder = Column(Integer, default=0)
    event = relationship("Event", back_populates="gallery")

class Leadership(Base):
    __tablename__ = "Leadership"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    photoUrl = Column(String(500), default="")
    bio = Column(Text, nullable=False)
    sortOrder = Column(Integer, default=0)
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())

class WhyChooseItem(Base):
    __tablename__ = "WhyChooseItem"
    
    id = Column(String(36), primary_key=True)
    text = Column(String(255), nullable=False)
    textUr = Column(String(255), default="")
    sortOrder = Column(Integer, default=0)

class AboutContent(Base):
    __tablename__ = "AboutContent"
    
    id = Column(String(36), primary_key=True, default="singleton")
    mission = Column(Text, nullable=False)
    missionUr = Column(Text, default="")
    vision = Column(Text, nullable=False)
    visionUr = Column(Text, default="")
    history = Column(Text, nullable=False)
    historyUr = Column(Text, default="")
    updatedAt = Column(DateTime, onupdate=func.now())

class Partner(Base):
    __tablename__ = "Partner"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    logoUrl = Column(String(500), nullable=False)
    websiteUrl = Column(String(500), nullable=False)
    sortOrder = Column(Integer, default=0)
    createdAt = Column(DateTime, server_default=func.now())

class MembershipApplication(Base):
    __tablename__ = "MembershipApplication"
    
    id = Column(String(36), primary_key=True)
    businessName = Column(String(255), nullable=False)
    ownerName = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    businessType = Column(String(255), nullable=False)
    registrationNo = Column(String(255), nullable=False)
    contactNo = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    cnicPath = Column(String(500), nullable=True)
    businessDocsPath = Column(String(500), nullable=True)
    status = Column(String(50), default="pending")
    remarks = Column(Text, default="")
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())

class ServiceRequest(Base):
    __tablename__ = "ServiceRequest"
    
    id = Column(String(36), primary_key=True)
    serviceId = Column(String(36), ForeignKey("Service.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    attachmentPath = Column(String(500), nullable=True)
    status = Column(String(50), default="new")
    createdAt = Column(DateTime, server_default=func.now())
    updatedAt = Column(DateTime, onupdate=func.now())
    service = relationship("Service", back_populates="requests")

class ActivityLog(Base):
    __tablename__ = "ActivityLog"
    
    id = Column(String(36), primary_key=True)
    adminId = Column(String(36), ForeignKey("AdminUser.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(255), nullable=False)
    entity = Column(String(255), nullable=False)
    details = Column(Text, default="")
    ip = Column(String(50), nullable=True)
    createdAt = Column(DateTime, server_default=func.now())
    admin = relationship("AdminUser", back_populates="activityLogs")
