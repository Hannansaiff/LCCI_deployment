from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id, generate_slug

router = APIRouter(prefix="/api/activities", tags=["activities"])

@router.get("/", response_model=List[schemas.Activity])
async def list_activities(
    skip: int = 0,
    limit: int = 100,
    home_only: bool = False,
    db: Session = Depends(get_db)
):
    """List all activities"""
    query = db.query(models.Activity)
    
    if home_only:
        query = query.filter(models.Activity.showOnHome == True)
    
    activities = query.order_by(models.Activity.date.desc()).offset(skip).limit(limit).all()
    return activities

@router.get("/slug/{slug}", response_model=schemas.Activity)
async def get_activity_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get activity by slug"""
    activity = db.query(models.Activity).filter(models.Activity.slug == slug).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return activity

@router.get("/{activity_id}", response_model=schemas.Activity)
async def get_activity(activity_id: str, db: Session = Depends(get_db)):
    """Get activity by ID"""
    activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return activity

@router.post("/", response_model=schemas.Activity)
async def create_activity(
    activity: schemas.ActivityCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create new activity (admin only)"""
    new_activity = models.Activity(
        id=generate_id(),
        title=activity.title,
        titleUr=activity.titleUr or "",
        slug=activity.slug or generate_slug(activity.title),
        description=activity.description,
        descriptionUr=activity.descriptionUr or "",
        imageUrl=activity.imageUrl or "",
        date=activity.date,
        showOnHome=activity.showOnHome
    )
    
    # Check slug uniqueness
    existing = db.query(models.Activity).filter(models.Activity.slug == new_activity.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    
    log_activity(db, current_admin.id, "CREATE", "Activity", f"Created activity: {new_activity.title}")
    
    return new_activity

@router.patch("/{activity_id}", response_model=schemas.Activity)
async def update_activity(
    activity_id: str,
    updates: schemas.ActivityUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update activity (admin only)"""
    activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    # Check slug uniqueness if being updated
    if updates.slug and updates.slug != activity.slug:
        existing = db.query(models.Activity).filter(models.Activity.slug == updates.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already exists")
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(activity, key, value)
    
    db.commit()
    db.refresh(activity)
    
    log_activity(db, current_admin.id, "UPDATE", "Activity", f"Updated activity: {activity.title}")
    
    return activity

@router.delete("/{activity_id}")
async def delete_activity(
    activity_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete activity (admin only)"""
    activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    db.delete(activity)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "Activity", f"Deleted activity: {activity.title}")
    
    return {"message": "Activity deleted successfully"}
