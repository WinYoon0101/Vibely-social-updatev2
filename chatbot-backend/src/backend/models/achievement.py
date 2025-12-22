from pydantic import BaseModel
from typing import List
from datetime import datetime

class Achievement(BaseModel):
    user: str
    title: str
    description: str
    type: str
    points: int
    unlocked_at: datetime
    created_at: datetime
