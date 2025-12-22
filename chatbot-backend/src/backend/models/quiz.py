from pydantic import BaseModel
from typing import List
from datetime import datetime

class Quiz(BaseModel):
    title: str
    subject: str
    level: str
    questions: List[dict]
    time_limit: int
    created_at: datetime
    updated_at: datetime