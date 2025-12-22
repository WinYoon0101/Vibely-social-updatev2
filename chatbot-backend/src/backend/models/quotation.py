from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Quotation(BaseModel):
    text: str
    author: str
