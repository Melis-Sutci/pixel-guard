import json
import logging
from typing import List, Dict, Optional, Any
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger(__name__)

class DeviceService:
    def __init__(self):
        self.android_devices = self._load_android_devices()
        self.ios_devices = self._load_ios_devices()

    def _load_android_devices(self) -> Dict[str, Any]:
        try:
            file_path = settings.DEVICES_DB_PATH / "android_devices.json"
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading Android devices: {str(e)}")
            return {"metadata": {}, "devices": {}}

    def _load_ios_devices(self) -> Dict[str, Any]:
        try:
            file_path = settings.DEVICES_DB_PATH / "ios_devices.json"
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading iOS devices: {str(e)}")
            return {"metadata": {}, "devices": {}}

    def get_all_devices(self, platform: Optional[str] = None) -> Dict[str, Any]:
        if platform == "android":
            return self.android_devices
        elif platform == "ios":
            return self.ios_devices
        else:
            return {"android": self.android_devices, "ios": self.ios_devices}

    def filter_devices(self, platform: str, os_versions: Optional[List[int]] = None, categories: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        if platform.lower() == "android":
            devices_dict = self.android_devices.get("devices", {})
        elif platform.lower() == "ios":
            devices_dict = self.ios_devices.get("devices", {})
        else:
            raise ValueError(f"Invalid platform: {platform}")

        filtered = []
        for device_name, device_data in devices_dict.items():
            if os_versions:
                device_os_versions = device_data.get("os_versions", [])
                if not any(v in device_os_versions for v in os_versions):
                    continue
            if categories:
                if device_data.get("category") not in categories:
                    continue
            filtered.append({"name": device_name, **device_data})

        filtered.sort(key=lambda x: x.get("popularity_score", 0), reverse=True)
        return filtered

def get_device_service() -> DeviceService:
    global _device_service
    if _device_service is None:
        _device_service = DeviceService()
    return _device_service

_device_service = None
