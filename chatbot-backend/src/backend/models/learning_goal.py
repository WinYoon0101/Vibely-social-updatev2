from pydantic import BaseModel
from typing import List
from datetime import datetime

class LearningGoal(BaseModel):
    user: str
    title: str
    description: str
    deadline: datetime
    status: str
    progress: float
    created_at: datetime
    updated_at: datetime

