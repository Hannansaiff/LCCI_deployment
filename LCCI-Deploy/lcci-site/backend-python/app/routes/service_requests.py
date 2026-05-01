from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id, save_upload_file
from app.config import settings

router = APIRouter(prefix="/api/service-requests", tags=["service-requests"])

@router.post("/", response_model=schemas.ServiceRequest)
async def create_service_request(
    form_data: schemas.ServiceRequestCreate,
    db: Session = Depends(get_db)
):
    """Create a new service request"""
    
    # Verify service exists
    service = db.query(models.Service).filter(models.Service.id == form_data.serviceId).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    new_request = models.ServiceRequest(
        id=generate_id(),
        serviceId=form_data.serviceId,
        name=form_data.name,
        email=form_data.email,
        phone=form_data.phone,
        message=form_data.message
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    return new_request

@router.post("/{request_id}/upload-attachment")
async def upload_service_request_attachment(
    request_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload attachment for service request"""
    
    service_request = db.query(models.ServiceRequest).filter(
        models.ServiceRequest.id == request_id
    ).first()
    
    if not service_request:
        raise HTTPException(status_code=404, detail="Service request not found")
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 5MB)")
    
    # Check file type
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Save file
    file_path = save_upload_file(content, file.filename, "service-requests")
    service_request.attachmentPath = file_path
    db.commit()
    
    return {"message": "Attachment uploaded successfully", "path": file_path}

@router.get("/", response_model=List[schemas.ServiceRequest])
async def list_service_requests(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """List all service requests (admin only)"""
    
    query = db.query(models.ServiceRequest)
    
    if status_filter:
        query = query.filter(models.ServiceRequest.status == status_filter)
    
    requests = query.order_by(models.ServiceRequest.createdAt.desc()).offset(skip).limit(limit).all()
    return requests

@router.get("/{request_id}", response_model=schemas.ServiceRequest)
async def get_service_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Get specific service request (admin only)"""
    
    service_request = db.query(models.ServiceRequest).filter(
        models.ServiceRequest.id == request_id
    ).first()
    
    if not service_request:
        raise HTTPException(status_code=404, detail="Service request not found")
    
    return service_request

@router.patch("/{request_id}", response_model=schemas.ServiceRequest)
async def update_service_request(
    request_id: str,
    updates: schemas.ServiceRequestUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update service request status (admin only)"""
    
    service_request = db.query(models.ServiceRequest).filter(
        models.ServiceRequest.id == request_id
    ).first()
    
    if not service_request:
        raise HTTPException(status_code=404, detail="Service request not found")
    
    if updates.status:
        service_request.status = updates.status
    
    db.commit()
    db.refresh(service_request)
    
    log_activity(db, current_admin.id, "UPDATE", "ServiceRequest", 
                f"Updated request {request_id}: status={updates.status}")
    
    return service_request

@router.delete("/{request_id}")
async def delete_service_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete service request (admin only)"""
    
    service_request = db.query(models.ServiceRequest).filter(
        models.ServiceRequest.id == request_id
    ).first()
    
    if not service_request:
        raise HTTPException(status_code=404, detail="Service request not found")
    
    db.delete(service_request)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "ServiceRequest", f"Deleted request {request_id}")
    
    return {"message": "Service request deleted successfully"}
