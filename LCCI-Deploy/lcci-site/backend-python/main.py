from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.config import settings
from app.database import engine, Base
from app import models  # noqa: F401 — registers all models with Base

# Create all tables (idempotent)
Base.metadata.create_all(bind=engine)

# Create routes
from app.routes import (
    auth, services, events, activities, leadership,
    partners, memberships, service_requests, content, logs, admin_users
)

# Initialize FastAPI app
app = FastAPI(
    title="LCCI Backend API",
    description="Backend API for Layyah Chamber of Commerce & Industry",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory if it exists
uploads_path = Path(settings.UPLOAD_DIR)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(services.router)
app.include_router(events.router)
app.include_router(activities.router)
app.include_router(leadership.router)
app.include_router(partners.router)
app.include_router(memberships.router)
app.include_router(service_requests.router)
app.include_router(content.router)
app.include_router(logs.router)
app.include_router(admin_users.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LCCI Backend API"}

@app.get("/")
async def root():
    return {"message": "LCCI Backend API", "documentation": "/docs", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
