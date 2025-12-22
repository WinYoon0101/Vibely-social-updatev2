from pydantic import BaseModel
from typing import List
from datetime import datetime

class LearningTree(BaseModel):
    user: str
    subject: str
    level: str
    nodes: List[dict]
    progress: float
    created_at: datetime
    updated_at: datetime