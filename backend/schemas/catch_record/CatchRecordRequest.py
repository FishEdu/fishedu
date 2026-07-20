from typing import Optional

from pydantic import BaseModel


class CatchRecordRequest(BaseModel):
    user_id: Optional[int] = None
    fish_id: Optional[int] = None
    fish_name: Optional[str] = None
    fishing_spot: str
    total_length: Optional[float] = None
    fork_length: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
