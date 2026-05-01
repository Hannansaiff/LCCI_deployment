from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id, generate_slug

router = APIRouter(prefix="/api/services", tags=["services"])

@router.get("/", response_model=List[schemas.Service])
async def list_services(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    """List all services"""
    query = db.query(models.Service)
    
    if active_only:
        query = query.filter(models.Service.active == True)
    
    services = query.order_by(models.Service.homeOrder).offset(skip).limit(limit).all()
    return services

@router.get("/slug/{slug}", response_model=schemas.Service)
async def get_service_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get service by slug"""
    service = db.query(models.Service).filter(models.Service.slug == slug).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return service

@router.get("/{service_id}", response_model=schemas.Service)
async def get_service(service_id: str, db: Session = Depends(get_db)):
    """Get service by ID"""
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return service

@router.post("/", response_model=schemas.Service)
async def create_service(
    service: schemas.ServiceCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create new service (admin only)"""
    new_service = models.Service(
        id=generate_id(),
        title=service.title,
        titleUr=service.titleUr or "",
        slug=service.slug or generate_slug(service.title),
        description=service.description,
        descriptionUr=service.descriptionUr or "",
        icon=service.icon or "briefcase",
        active=service.active,
        showOnHome=service.showOnHome,
        homeOrder=service.homeOrder
    )
    
    # Check slug uniqueness
    existing = db.query(models.Service).filter(models.Service.slug == new_service.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    
    log_activity(db, current_admin.id, "CREATE", "Service", f"Created service: {new_service.title}")
    
    return new_service

@router.patch("/{service_id}", response_model=schemas.Service)
async def update_service(
    service_id: str,
    updates: schemas.ServiceUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update service (admin only)"""
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Check slug uniqueness if being updated
    if updates.slug and updates.slug != service.slug:
        existing = db.query(models.Service).filter(models.Service.slug == updates.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already exists")
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(service, key, value)
    
    db.commit()
    db.refresh(service)
    
    log_activity(db, current_admin.id, "UPDATE", "Service", f"Updated service: {service.title}")
    
    return service

@router.delete("/{service_id}")
async def delete_service(
    service_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete service (admin only)"""
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(service)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "Service", f"Deleted service: {service.title}")
    
    return {"message": "Service deleted successfully"}
