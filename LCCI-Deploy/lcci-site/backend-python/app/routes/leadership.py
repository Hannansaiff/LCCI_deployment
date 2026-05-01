from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id

router = APIRouter(prefix="/api/leadership", tags=["leadership"])

@router.get("/", response_model=List[schemas.Leadership])
async def list_leadership(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all leadership team members"""
    members = db.query(models.Leadership).order_by(models.Leadership.sortOrder).offset(skip).limit(limit).all()
    return members

@router.get("/{member_id}", response_model=schemas.Leadership)
async def get_leadership_member(member_id: str, db: Session = Depends(get_db)):
    """Get leadership team member by ID"""
    member = db.query(models.Leadership).filter(models.Leadership.id == member_id).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Leadership member not found")
    
    return member

@router.post("/", response_model=schemas.Leadership)
async def create_leadership_member(
    member: schemas.LeadershipCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create new leadership team member (admin only)"""
    new_member = models.Leadership(
        id=generate_id(),
        name=member.name,
        role=member.role,
        bio=member.bio,
        photoUrl=member.photoUrl or "",
        sortOrder=member.sortOrder
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    log_activity(db, current_admin.id, "CREATE", "Leadership", f"Created leadership member: {new_member.name}")
    
    return new_member

@router.patch("/{member_id}", response_model=schemas.Leadership)
async def update_leadership_member(
    member_id: str,
    updates: schemas.LeadershipUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update leadership team member (admin only)"""
    member = db.query(models.Leadership).filter(models.Leadership.id == member_id).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Leadership member not found")
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(member, key, value)
    
    db.commit()
    db.refresh(member)
    
    log_activity(db, current_admin.id, "UPDATE", "Leadership", f"Updated leadership member: {member.name}")
    
    return member

@router.delete("/{member_id}")
async def delete_leadership_member(
    member_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete leadership team member (admin only)"""
    member = db.query(models.Leadership).filter(models.Leadership.id == member_id).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Leadership member not found")
    
    db.delete(member)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "Leadership", f"Deleted leadership member: {member.name}")
    
    return {"message": "Leadership member deleted successfully"}
