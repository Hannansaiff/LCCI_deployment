from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id

router = APIRouter(prefix="/api/admin/users", tags=["admin-users"])

@router.get("/", response_model=List[schemas.AdminUser])
async def list_admin_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """List all admin users (admin only)"""
    users = db.query(models.AdminUser).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.AdminUser)
async def get_admin_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Get admin user by ID (admin only)"""
    user = db.query(models.AdminUser).filter(models.AdminUser.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    return user

@router.post("/", response_model=schemas.AdminUser)
async def create_admin_user(
    user: schemas.AdminUserCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create new admin user (admin only)"""
    
    # Check if user already exists
    db_user = db.query(models.AdminUser).filter(
        (models.AdminUser.username == user.username) | 
        (models.AdminUser.email == user.email)
    ).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    from app.security import hash_password
    new_user = models.AdminUser(
        id=generate_id(),
        username=user.username,
        email=user.email,
        passwordHash=hash_password(user.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_activity(db, current_admin.id, "CREATE", "AdminUser", f"Created admin user: {new_user.username}")
    
    return new_user

@router.delete("/{user_id}")
async def delete_admin_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete admin user (admin only)"""
    
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    user = db.query(models.AdminUser).filter(models.AdminUser.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    db.delete(user)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "AdminUser", f"Deleted admin user: {user.username}")
    
    return {"message": "Admin user deleted successfully"}
