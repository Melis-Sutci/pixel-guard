from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

router = APIRouter()
screens_db = {}

class CreateScreenRequest(BaseModel):
    name: str
    figma_url: str
    platform: str
    description: Optional[str] = None

@router.post("/")
async def create_screen(request: CreateScreenRequest):
    screen_id = str(uuid.uuid4())
    screen = {
        "id": screen_id,
        "name": request.name,
        "figma_url": request.figma_url,
        "platform": request.platform,
        "description": request.description,
        "created_at": datetime.now().isoformat()
    }
    screens_db[screen_id] = screen
    return {"success": True, "data": screen}

@router.get("/")
async def list_screens():
    return {"count": len(screens_db), "screens": list(screens_db.values())}
