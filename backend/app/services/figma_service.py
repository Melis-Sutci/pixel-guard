import httpx
import logging
from typing import Dict, Optional, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class FigmaService:
    BASE_URL = "https://api.figma.com/v1"

    def __init__(self, access_token: Optional[str] = None):
        self.access_token = access_token or settings.FIGMA_ACCESS_TOKEN
        if not self.access_token:
            raise ValueError("Figma access token is required")
        self.headers = {
            "X-Figma-Token": self.access_token,
            "Content-Type": "application/json"
        }

    def parse_figma_url(self, url: str) -> Dict[str, str]:
        try:
            if "/file/" in url:
                file_key = url.split("/file/")[1].split("/")[0]
            else:
                raise ValueError("Invalid Figma URL format")
            node_id = None
            if "node-id=" in url:
                node_id = url.split("node-id=")[1].split("&")[0]
            return {"file_key": file_key, "node_id": node_id}
        except Exception as e:
            logger.error(f"Error parsing Figma URL: {str(e)}")
            raise ValueError(f"Invalid Figma URL: {str(e)}")

    async def get_file(self, file_key: str) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(f"{self.BASE_URL}/files/{file_key}", headers=self.headers)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Error fetching Figma file: {str(e)}")
            raise

def get_figma_service() -> FigmaService:
    global _figma_service
    if _figma_service is None:
        _figma_service = FigmaService()
    return _figma_service

_figma_service = None
