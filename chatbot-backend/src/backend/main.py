from fastapi import FastAPI, Depends, Response, status, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from odmantic import AIOEngine
from motor.motor_asyncio import AsyncIOMotorClient
import requests
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Annotated, Optional
from contextlib import asynccontextmanager
import asyncio
import os
import sys
from dotenv import load_dotenv

# Thêm thư mục gốc vào sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_integration.huggingface_client import embed_model
from llm_integration.openai_client import llmAgent, llmRetriever, llmTitle, llmTransform
from llm_integration.weaviate_client import weaviate_client
import warnings
warnings.filterwarnings("ignore", category=ResourceWarning)

# Load biến môi trường từ file .env
load_dotenv()

# Cấu hình môi trường
ENV = os.getenv("ENV", "development")
BACKEND_URL = os.getenv("NEXT_PUBLIC_BACKEND_URL", "http://localhost:8081")

# Middleware để verify token từ backend chính
async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid"
        )
    
    token = authorization.split(" ")[1]
    try:
        # Gọi API verify token từ backend
        response = requests.post(
            f"{BACKEND_URL}/user/check-auth",
            headers={"Authorization": f"Bearer {token}"}
        )
        response.raise_for_status()  # Kiểm tra lỗi HTTP
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

# Hàm quản lý vòng đời ứng dụng
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App is starting") 

    # Lưu các mô hình vào trạng thái ứng dụng để dùng lại mà không cần khởi tạo nhiều lần
    app.state.embed_model = embed_model
    app.state.llmAgent = llmAgent
    app.state.llmRetriever = llmRetriever
    app.state.llmTitle = llmTitle
    app.state.llmTransform = llmTransform
    app.state.weaviate_client = weaviate_client
    
    try: 
        yield  # Chạy ứng dụng khi khởi tạo xong
        print("App is shutting down")  
    finally:
        print("App is shutting down")  

# Khởi tạo ứng dụng FastAPI và gắn vòng đời `lifespan`
app = FastAPI(lifespan=lifespan)

# Cấu hình CORS (cho phép frontend giao tiếp với backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://vibely-study-social-web-user.vercel.app",
        "https://vibely-study-social-web.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thêm router chat vào ứng dụng và áp dụng middleware verify token
app.include_router(
    chat_router, 
    prefix="/chatbot", 
    tags=["chat"],
    dependencies=[Depends(verify_token)]
)  