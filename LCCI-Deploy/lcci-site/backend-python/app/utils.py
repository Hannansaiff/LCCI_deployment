import os
import uuid
import re
from pathlib import Path
from app.config import settings

def generate_id() -> str:
    return str(uuid.uuid4())

def safe_filename(filename: str) -> str:
    """Remove special characters from filename"""
    return re.sub(r'[^a-zA-Z0-9._-]', '_', filename)

def ensure_upload_dir(subdir: str = "") -> str:
    """Ensure upload directory exists and return path"""
    if subdir:
        upload_path = os.path.join(settings.UPLOAD_DIR, subdir)
    else:
        upload_path = settings.UPLOAD_DIR
    
    Path(upload_path).mkdir(parents=True, exist_ok=True)
    return upload_path

def save_upload_file(file_content: bytes, original_filename: str, subdir: str = "") -> str:
    """Save uploaded file and return relative path"""
    upload_path = ensure_upload_dir(subdir)
    
    # Generate unique filename
    filename = f"{uuid.uuid4().hex}_{safe_filename(original_filename)}"
    file_path = os.path.join(upload_path, filename)
    
    # Save file
    with open(file_path, 'wb') as f:
        f.write(file_content)
    
    # Return relative path for storage
    if subdir:
        return f"/uploads/{subdir}/{filename}"
    else:
        return f"/uploads/{filename}"

def generate_slug(text: str) -> str:
    """Generate URL-friendly slug from text"""
    slug = re.sub(r'[^\w\s-]', '', text).strip()
    slug = re.sub(r'[-\s]+', '-', slug).lower()
    return slug

def get_or_singleton(db, model, singleton_id: str = "singleton"):
    """Get singleton record or create default one"""
    record = db.query(model).filter(model.id == singleton_id).first()
    if not record:
        record = model(id=singleton_id)
        db.add(record)
        db.commit()
        db.refresh(record)
    return record
