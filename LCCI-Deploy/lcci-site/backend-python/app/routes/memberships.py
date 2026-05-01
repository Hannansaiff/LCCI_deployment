from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id, save_upload_file
from app.config import settings

router = APIRouter(prefix="/api/memberships", tags=["memberships"])

@router.post("/applications", response_model=schemas.MembershipApplication)
async def submit_membership_application(
    form_data: schemas.MembershipApplicationCreate,
    db: Session = Depends(get_db)
):
    """Submit a new membership application"""
    
    new_application = models.MembershipApplication(
        id=generate_id(),
        businessName=form_data.businessName,
        ownerName=form_data.ownerName,
        address=form_data.address,
        businessType=form_data.businessType,
        registrationNo=form_data.registrationNo,
        contactNo=form_data.contactNo,
        email=form_data.email
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return new_application

@router.post("/applications/{app_id}/upload-cnic")
async def upload_cnic(
    app_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload CNIC document for membership application"""
    
    application = db.query(models.MembershipApplication).filter(
        models.MembershipApplication.id == app_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    
    # Check file type
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Save file
    file_path = save_upload_file(content, file.filename, "membership/cnic")
    application.cnicPath = file_path
    db.commit()
    
    return {"message": "CNIC uploaded successfully", "path": file_path}

@router.post("/applications/{app_id}/upload-docs")
async def upload_business_docs(
    app_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload business documents for membership application"""
    
    application = db.query(models.MembershipApplication).filter(
        models.MembershipApplication.id == app_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    
    # Check file type
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Save file
    file_path = save_upload_file(content, file.filename, "membership/docs")
    application.businessDocsPath = file_path
    db.commit()
    
    return {"message": "Business documents uploaded successfully", "path": file_path}

@router.get("/applications", response_model=List[schemas.MembershipApplication])
async def list_membership_applications(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """List all membership applications (admin only)"""
    
    query = db.query(models.MembershipApplication)
    
    if status_filter:
        query = query.filter(models.MembershipApplication.status == status_filter)
    
    applications = query.order_by(models.MembershipApplication.createdAt.desc()).offset(skip).limit(limit).all()
    return applications

@router.get("/applications/{app_id}", response_model=schemas.MembershipApplication)
async def get_membership_application(
    app_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Get specific membership application (admin only)"""
    
    application = db.query(models.MembershipApplication).filter(
        models.MembershipApplication.id == app_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application

@router.patch("/applications/{app_id}", response_model=schemas.MembershipApplication)
async def update_membership_application(
    app_id: str,
    updates: schemas.MembershipApplicationUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update membership application status (admin only)"""
    
    application = db.query(models.MembershipApplication).filter(
        models.MembershipApplication.id == app_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if updates.status:
        application.status = updates.status
    if updates.remarks:
        application.remarks = updates.remarks
    
    db.commit()
    db.refresh(application)
    
    log_activity(db, current_admin.id, "UPDATE", "MembershipApplication", 
                f"Updated application {app_id}: status={updates.status}")
    
    return application
