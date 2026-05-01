from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.security import get_current_admin, log_activity
from app.utils import generate_id, generate_slug

router = APIRouter(prefix="/api/events", tags=["events"])

@router.get("/", response_model=List[schemas.Event])
async def list_events(
    skip: int = 0,
    limit: int = 100,
    visible_only: bool = False,
    db: Session = Depends(get_db)
):
    """List all events"""
    query = db.query(models.Event)
    
    if visible_only:
        query = query.filter(models.Event.hidden == False)
    
    events = query.order_by(models.Event.date.desc()).offset(skip).limit(limit).all()
    return events

@router.get("/slug/{slug}", response_model=schemas.Event)
async def get_event_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get event by slug"""
    event = db.query(models.Event).filter(models.Event.slug == slug).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return event

@router.get("/{event_id}", response_model=schemas.Event)
async def get_event(event_id: str, db: Session = Depends(get_db)):
    """Get event by ID"""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return event

@router.post("/", response_model=schemas.Event)
async def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Create new event (admin only)"""
    new_event = models.Event(
        id=generate_id(),
        title=event.title,
        slug=event.slug or generate_slug(event.title),
        excerpt=event.excerpt,
        description=event.description,
        category=event.category or "General",
        date=event.date,
        imageUrl=event.imageUrl or "",
        pdfUrl=event.pdfUrl or "",
        highlighted=event.highlighted,
        hidden=event.hidden
    )
    
    # Check slug uniqueness
    existing = db.query(models.Event).filter(models.Event.slug == new_event.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    log_activity(db, current_admin.id, "CREATE", "Event", f"Created event: {new_event.title}")
    
    return new_event

@router.patch("/{event_id}", response_model=schemas.Event)
async def update_event(
    event_id: str,
    updates: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Update event (admin only)"""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check slug uniqueness if being updated
    if updates.slug and updates.slug != event.slug:
        existing = db.query(models.Event).filter(models.Event.slug == updates.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already exists")
    
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(event, key, value)
    
    db.commit()
    db.refresh(event)
    
    log_activity(db, current_admin.id, "UPDATE", "Event", f"Updated event: {event.title}")
    
    return event

@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete event (admin only)"""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "Event", f"Deleted event: {event.title}")
    
    return {"message": "Event deleted successfully"}

# Event Gallery endpoints
@router.post("/{event_id}/gallery", response_model=schemas.EventGallery)
async def add_event_gallery(
    event_id: str,
    gallery: schemas.EventGalleryCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Add gallery image to event (admin only)"""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    new_gallery = models.EventGallery(
        id=generate_id(),
        eventId=event_id,
        imageUrl=gallery.imageUrl,
        sortOrder=gallery.sortOrder
    )
    
    db.add(new_gallery)
    db.commit()
    db.refresh(new_gallery)
    
    log_activity(db, current_admin.id, "CREATE", "EventGallery", f"Added gallery to event {event_id}")
    
    return new_gallery

@router.delete("/{event_id}/gallery/{gallery_id}")
async def delete_event_gallery(
    event_id: str,
    gallery_id: str,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    """Delete gallery image (admin only)"""
    gallery = db.query(models.EventGallery).filter(
        (models.EventGallery.id == gallery_id) & 
        (models.EventGallery.eventId == event_id)
    ).first()
    
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    
    db.delete(gallery)
    db.commit()
    
    log_activity(db, current_admin.id, "DELETE", "EventGallery", f"Deleted gallery from event {event_id}")
    
    return {"message": "Gallery image deleted successfully"}
