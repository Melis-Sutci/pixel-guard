from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.figma_service import get_figma_service

router = APIRouter()

class FigmaUrlRequest(BaseModel):
    url: str
    access_token: Optional[str] = None

@router.post("/parse-url")
async def parse_figma_url(request: FigmaUrlRequest):
    try:
        service = get_figma_service()
        parsed = service.parse_figma_url(request.url)
        return {"success": True, "data": parsed}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
