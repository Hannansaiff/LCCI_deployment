from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id

router = APIRouter(prefix="/api/partners", tags=["partners"])

@router.get("/", response_model=List[schemas.Partner])
async def list_partners(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all partners"""
    partners = db.query(models.Partner).order_by(models.Partner.sortOrder).offset(skip).limit(limit).all()
    return partners

@router.get("/{partner_id}", response_model=schemas.Partner)
async def get_partner(partner_id: str, db: Session = Depends(get_db)):
    """Get partner by ID"""
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    return partner

@router.post("/", response_model=schemas.Partner)
async def create_partner(
    partner: schemas.PartnerCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create new partner (admin only)"""
    new_partner = models.Partner(
        id=generate_id(),
        name=partner.name,
        logoUrl=partner.logoUrl,
        websiteUrl=partner.websiteUrl,
        sortOrder=partner.sortOrder
    )
    
    db.add(new_partner)
    db.commit()
    db.refresh(new_partner)
    
    log_activity(db, current_admin.id, "CREATE", "Partner", f"Created partner: {new_partner.name}")
    
    return new_partner

@router.patch("/{partner_id}", response_model=schemas.Partner)
async def update_partner(
    partner_id: str,
    updates: schemas.PartnerUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update partner (admin only)"""
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(partner, key, value)
    
    db.commit()
    db.refresh(partner)
    
    log_activity(db, current_admin.id, "UPDATE", "Partner", f"Updated partner: {partner.name}")
    
    return partner

@router.delete("/{partner_id}")
async def delete_partner(
    partner_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete partner (admin only)"""
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    db.delete(partner)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "Partner", f"Deleted partner: {partner.name}")
    
    return {"message": "Partner deleted successfully"}
