from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id, get_or_singleton

router = APIRouter(prefix="/api/content", tags=["content"])

# Site Settings endpoints
@router.get("/settings", response_model=schemas.SiteSettings)
async def get_site_settings(db: Session = Depends(get_db)):
    """Get site settings"""
    settings = get_or_singleton(db, models.SiteSettings)
    return settings

@router.patch("/settings", response_model=schemas.SiteSettings)
async def update_site_settings(
    updates: schemas.SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update site settings (admin only)"""
    settings = get_or_singleton(db, models.SiteSettings)
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    
    log_activity(db, current_admin.id, "UPDATE", "SiteSettings", "Updated site settings")
    
    return settings

# Hero Section endpoints
@router.get("/hero", response_model=schemas.HeroSection)
async def get_hero_section(db: Session = Depends(get_db)):
    """Get hero section"""
    hero = get_or_singleton(db, models.HeroSection)
    return hero

@router.patch("/hero", response_model=schemas.HeroSection)
async def update_hero_section(
    updates: schemas.HeroSectionUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update hero section (admin only)"""
    hero = get_or_singleton(db, models.HeroSection)
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(hero, key, value)
    
    db.commit()
    db.refresh(hero)
    
    log_activity(db, current_admin.id, "UPDATE", "HeroSection", "Updated hero section")
    
    return hero

# About Content endpoints
@router.get("/about", response_model=schemas.AboutContent)
async def get_about_content(db: Session = Depends(get_db)):
    """Get about content"""
    about = get_or_singleton(db, models.AboutContent)
    return about

@router.patch("/about", response_model=schemas.AboutContent)
async def update_about_content(
    updates: schemas.AboutContentUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update about content (admin only)"""
    about = get_or_singleton(db, models.AboutContent)
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(about, key, value)
    
    db.commit()
    db.refresh(about)
    
    log_activity(db, current_admin.id, "UPDATE", "AboutContent", "Updated about content")
    
    return about

# Why Choose Items endpoints
@router.get("/why-choose", response_model=List[schemas.WhyChooseItem])
async def list_why_choose_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List why choose items"""
    items = db.query(models.WhyChooseItem).order_by(models.WhyChooseItem.sortOrder).offset(skip).limit(limit).all()
    return items

@router.get("/why-choose/{item_id}", response_model=schemas.WhyChooseItem)
async def get_why_choose_item(item_id: str, db: Session = Depends(get_db)):
    """Get why choose item by ID"""
    item = db.query(models.WhyChooseItem).filter(models.WhyChooseItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Why choose item not found")
    
    return item

@router.post("/why-choose", response_model=schemas.WhyChooseItem)
async def create_why_choose_item(
    item: schemas.WhyChooseItemCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create why choose item (admin only)"""
    new_item = models.WhyChooseItem(
        id=generate_id(),
        text=item.text,
        textUr=item.textUr or "",
        sortOrder=item.sortOrder
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    log_activity(db, current_admin.id, "CREATE", "WhyChooseItem", f"Created why choose item")
    
    return new_item

@router.patch("/why-choose/{item_id}", response_model=schemas.WhyChooseItem)
async def update_why_choose_item(
    item_id: str,
    updates: schemas.WhyChooseItemUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update why choose item (admin only)"""
    item = db.query(models.WhyChooseItem).filter(models.WhyChooseItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Why choose item not found")
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    
    log_activity(db, current_admin.id, "UPDATE", "WhyChooseItem", f"Updated why choose item")
    
    return item

@router.delete("/why-choose/{item_id}")
async def delete_why_choose_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete why choose item (admin only)"""
    item = db.query(models.WhyChooseItem).filter(models.WhyChooseItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Why choose item not found")
    
    db.delete(item)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "WhyChooseItem", f"Deleted why choose item")
    
    return {"message": "Why choose item deleted successfully"}
