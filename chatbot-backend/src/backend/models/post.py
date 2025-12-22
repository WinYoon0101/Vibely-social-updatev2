from odmantic import Model
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# 🌟 Schema cho reaction (cảm xúc)
class Reaction(BaseModel):
    user: str  # ID người dùng
    type: str = Field(default="like", regex="^(like|love|haha|wow|sad|angry)$")
    created_at: datetime = Field(default_factory=datetime.utcnow)

# 🌟 Schema cho trả lời (reply)
class Reply(BaseModel):
    user: str  # ID người dùng
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# 🌟 Schema cho comment (bình luận)
class Comment(BaseModel):
    user: str  # ID người dùng
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reactions: List[Reaction] = []  # Cảm xúc của bình luận
    replies: List[Reply] = []  # Danh sách phản hồi

# 🌟 Schema tổng hợp thống kê cảm xúc
class ReactionStats(BaseModel):
    like: int = 0
    love: int = 0
    haha: int = 0
    wow: int = 0
    sad: int = 0
    angry: int = 0

# 🌟 Schema Pydantic để validate API
class PostSchema(BaseModel):
    user: str  # ID người dùng
    content: Optional[str] = None
    media_url: Optional[str] = None
    media_type: Optional[str] = Field(None, regex="^(image|video)$")

    reactions: List[Reaction] = []  # Danh sách cảm xúc
    comments: List[Comment] = []  # Danh sách bình luận

    reaction_stats: ReactionStats = ReactionStats()  # Thống kê cảm xúc
    comment_count: int = 0  # Tổng số bình luận
    share: List[str] = []  # Danh sách người chia sẻ
    share_count: int = 0  # Số lần chia sẻ

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True

# 🌟 Model ODMantic để lưu MongoDB (kế thừa từ PostSchema)
class Post(PostSchema, Model):
    pass
