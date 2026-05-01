from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.security import hash_password, verify_password, create_access_token, get_current_admin, log_activity
from app.utils import generate_id
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.AdminUser)
async def register(
    user: schemas.AdminUserCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create a new admin user (admin only)"""
    
    # Check if user already exists
    db_user = db.query(models.AdminUser).filter(
        (models.AdminUser.username == user.username) | 
        (models.AdminUser.email == user.email)
    ).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    new_user = models.AdminUser(
        id=generate_id(),
        username=user.username,
        email=user.email,
        passwordHash=hash_password(user.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_activity(db, current_admin.id, "CREATE", "AdminUser", f"Created user: {new_user.username}")
    
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(credentials: schemas.AdminUserLogin, db: Session = Depends(get_db)):
    """Login admin user"""
    
    user = db.query(models.AdminUser).filter(models.AdminUser.username == credentials.username).first()
    
    if not user or not verify_password(credentials.password, user.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.AdminUser)
async def get_current_user(current_admin: models.AdminUser = Depends(get_current_admin)):
    """Get current logged in admin user"""
    return current_admin

@router.post("/logout")
async def logout(current_admin: models.AdminUser = Depends(get_current_admin)):
    """Logout admin user (client should discard token)"""
    return {"message": "Logout successful"}
