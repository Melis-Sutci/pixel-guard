from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
import uuid
from datetime import datetime

router = APIRouter()
tests_db = {}

class CreateTestRequest(BaseModel):
    screen_id: str
    platform: str
    device_filter: Dict[str, Any]

@router.post("/")
async def create_test(request: CreateTestRequest):
    test_id = str(uuid.uuid4())
    test = {
        "id": test_id,
        "screen_id": request.screen_id,
        "platform": request.platform,
        "status": "pending",
        "created_at": datetime.now().isoformat()
    }
    tests_db[test_id] = test
    return {"success": True, "data": test}

@router.get("/")
async def list_tests():
    return {"count": len(tests_db), "tests": list(tests_db.values())}
