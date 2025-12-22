from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from enum import Enum
from bson import ObjectId

# Định nghĩa Enum cho role để tránh nhập sai dữ liệu
class Role(str, Enum):
    USER = "user"
    MODEL = "model"

# Model cho phần nội dung (text)
class Part(BaseModel):
    text: str
    _id: Optional[str] = None  # Thêm _id cho mỗi part

# Model cho một tin nhắn trong lịch sử hội thoại
class HistoryItem(BaseModel):
    role: Role
    parts: List[Part]
    _id: Optional[str] = None  # Thêm _id cho mỗi history item
    img: Optional[str] = None

# Model chính cho cuộc hội thoại
class Chat(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )
    
    _id: Optional[str] = None  # Thêm _id cho document
    user: str
    history: List[HistoryItem] = []
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")
    v: int = Field(default=0, alias="__v")
