from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Document(BaseModel):
    title: str  
    pages: int  
    level: str  
    subject: str  
    file_type: str 
    upload_date: datetime = Field(default_factory=datetime.utcnow)  
    file_url: str  

    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
