"""
Pixel Guard - AI-Powered Mobile UI Testing Platform
Main FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.api.routes import devices, screens, tests, figma

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Pixel Guard API",
    description="AI-Powered Mobile Pixel Testing Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """System health check"""
    return {
        "status": "healthy",
        "service": "Pixel Guard API",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """API Root"""
    return {
        "message": "Welcome to Pixel Guard API",
        "docs": "/api/docs",
        "health": "/health"
    }

app.include_router(devices.router, prefix="/api/devices", tags=["Devices"])
app.include_router(screens.router, prefix="/api/screens", tags=["Screens"])
app.include_router(tests.router, prefix="/api/tests", tags=["Tests"])
app.include_router(figma.router, prefix="/api/figma", tags=["Figma"])

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Pixel Guard API Starting...")
    logger.info(f"📝 Debug Mode: {settings.DEBUG_MODE}")
    logger.info(f"🔗 API Docs: http://{settings.API_HOST}:{settings.API_PORT}/api/docs")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Pixel Guard API Shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG_MODE
    )
