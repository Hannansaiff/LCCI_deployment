from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.get("/", response_model=List[schemas.ActivityLog])
async def list_activity_logs(
    skip: int = 0,
    limit: int = 100,
    entity_filter: Optional[str] = None,
    admin_id_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """List activity logs (admin only)"""
    query = db.query(models.ActivityLog)
    
    if entity_filter:
        query = query.filter(models.ActivityLog.entity == entity_filter)
    
    if admin_id_filter:
        query = query.filter(models.ActivityLog.adminId == admin_id_filter)
    
    logs = query.order_by(models.ActivityLog.createdAt.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/stats")
async def get_activity_stats(
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Get activity statistics (admin only)"""
    total_logs = db.query(models.ActivityLog).count()
    
    # Get action distribution
    actions = db.query(models.ActivityLog.action, models.ActivityLog).count().all()
    
    return {
        "total_logs": total_logs
    }
