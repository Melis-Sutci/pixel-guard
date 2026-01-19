from fastapi import APIRouter, Query
from typing import Optional, List
from pydantic import BaseModel
from app.services.device_service import get_device_service

router = APIRouter()

class DeviceFilterRequest(BaseModel):
    platform: str
    os_versions: Optional[List[int]] = None
    categories: Optional[List[str]] = None

@router.get("/")
async def get_all_devices(platform: Optional[str] = Query(None)):
    service = get_device_service()
    return service.get_all_devices(platform)

@router.post("/filter")
async def filter_devices(request: DeviceFilterRequest):
    service = get_device_service()
    devices = service.filter_devices(request.platform, request.os_versions, request.categories)
    return {"count": len(devices), "devices": devices}
