
# Script to initialize database with sample data

import sys
sys.path.insert(0, '.')

from app.database import SessionLocal, engine, Base
from app import models
from app.security import hash_password
from app.utils import generate_id
from datetime import datetime, timedelta

# Create all tables
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("Initializing LCCI Database...")

try:
    # Check if default admin exists
    admin = db.query(models.AdminUser).filter(
        models.AdminUser.username == "admin"
    ).first()
    
    if not admin:
        # Create default admin user
        default_admin = models.AdminUser(
            id=generate_id(),
            username="admin",
            email="admin@lcci.org.pk",
            passwordHash=hash_password("admin123"),  # Change this in production!
            createdAt=datetime.now(),
            updatedAt=datetime.now()
        )
        db.add(default_admin)
        db.commit()
        print("✓ Created default admin user (username: admin, password: admin123)")
    
    # Create default site settings if not exists
    settings = db.query(models.SiteSettings).filter(
        models.SiteSettings.id == "singleton"
    ).first()
    
    if not settings:
        default_settings = models.SiteSettings(
            id="singleton",
            primaryColor="#0B6E4F",
            secondaryColor="#0A2A43",
            accentColor="#FFD166",
            backgroundColor="#F5F7FA",
            logoUrl="",
            topBarPhone="+92-300-1234567",
            topBarEmail="info@lcci.org.pk",
            facebookUrl="",
            twitterUrl="",
            linkedinUrl="",
            youtubeUrl="",
            footerText="© Layyah Chamber of Commerce & Industry",
            address="Layyah, Punjab, Pakistan",
            metaTitle="LCCI – Layyah Chamber of Commerce & Industry",
            metaDescription="Supporting local businesses in Layyah.",
            metaKeywords="LCCI, Layyah, Chamber of Commerce",
            updatedAt=datetime.now()
        )
        db.add(default_settings)
        db.commit()
        print("✓ Created default site settings")
    
    # Create default hero section if not exists
    hero = db.query(models.HeroSection).filter(
        models.HeroSection.id == "singleton"
    ).first()
    
    if not hero:
        default_hero = models.HeroSection(
            id="singleton",
            title="Welcome to LCCI",
            titleUr="ایل سی سی آئی میں خوش آمدید",
            subtitle="Supporting Layyah's Business Community",
            subtitleUr="لیہ کے کاروباری معاشرے کی حمایت کریں",
            imageUrl="/images/hero.jpg",
            btn1Text="Learn More",
            btn1TextUr="مزید جانیں",
            btn2Text="Become a Member",
            btn2TextUr="رکن بنیں",
            btn1Enabled=True,
            btn2Enabled=True,
            updatedAt=datetime.now()
        )
        db.add(default_hero)
        db.commit()
        print("✓ Created default hero section")
    
    # Create default about content if not exists
    about = db.query(models.AboutContent).filter(
        models.AboutContent.id == "singleton"
    ).first()
    
    if not about:
        default_about = models.AboutContent(
            id="singleton",
            mission="To promote and support the business community in Layyah",
            missionUr="لیہ میں کاروباری معاشرے کی حمایت اور فروغ",
            vision="A thriving business hub in Layyah",
            visionUr="لیہ میں ایک ترقی پذیر کاروباری مرکز",
            history="LCCI was founded to serve the business community",
            historyUr="",
            updatedAt=datetime.now()
        )
        db.add(default_about)
        db.commit()
        print("✓ Created default about content")
    
    print("\n✓ Database initialization complete!")
    print("\nIMPORTANT: Change the default admin password immediately in production!")
    
except Exception as e:
    print(f"✗ Error during initialization: {e}")
    db.rollback()
finally:
    db.close()
