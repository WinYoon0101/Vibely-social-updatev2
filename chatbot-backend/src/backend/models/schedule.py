from odmantic import Model
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Model lưu trữ trên MongoDB (ODMantic)
class Schedule(Model):
    user: str  
    subject: str = Field(..., max_length=100)  # Giới hạn 100 ký tự
    start_time: datetime
    end_time: datetime
    category_color: Optional[str] = Field(default="#0000FF")

    class Config:
        collection = "schedules"  

# Schema dùng để validate request/response (Pydantic)
class ScheduleSchema(BaseModel):
    user: str
    subject: str = Field(..., max_length=100)
    start_time: datetime
    end_time: datetime
    category_color: Optional[str] = None
