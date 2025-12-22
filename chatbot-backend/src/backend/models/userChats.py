from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

# 🌟 Đại diện cho một cuộc trò chuyện
class ChatSummary(BaseModel):
    _id: str  # ObjectId của Chatbot
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# 🌟 Đại diện cho danh sách cuộc trò chuyện của User
class UserChats(BaseModel):
    user: str  # ObjectId của User
    chats: List[ChatSummary] = []  # Danh sách các cuộc trò chuyện
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
