from fastapi import APIRouter, Depends, HTTPException, Request, FastAPI
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
from models.chat import Chat, HistoryItem, Part, Role
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import time 
import sys
import os

# Thêm thư mục gốc vào sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from llm_integration.openai_client import get_llmTitle
from core.ai.ai_service import get_answer_stream
from llama_index.core import PromptTemplate
import yaml
import warnings
import csv
warnings.filterwarnings("ignore", category=ResourceWarning)

# Load YAML configuration file
def load_config(config_file=None):
    if config_file is None:
        # Sử dụng đường dẫn tương đối từ thư mục gốc của dự án
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        config_file = os.path.join(base_dir, "configs", "api_key.yaml")
    
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Load the MongoDB configuration from YAML
config = load_config()
url = config["mongodb"]["url"]
client = MongoClient(url, connect=False)
db = client["StudyWeb"]
chat_collection = db["chatbots"]  # Đổi tên collection thành chatbots
user_chats_collection = db["userchats"]

router = APIRouter()

async def generate_gpt_response(prompt: str) -> AsyncGenerator[str, None]:
    """
    Generates a GPT response for the given prompt using OpenAI's GPT API.
    """
    system_str = """
"Bạn là trợ lý tạo ra câu tóm tắt ngắn gọn cho một đoạn hội thoại khi chỉ biết một câu đầu tiên trong đoạn hội thoại. Nhiệm vụ của bạn là tạo ra một câu không quá 15 từ nói về chủ đề của cuộc hội thoại (trong tiêu đề không được nhắc 'hội thoại', 'học viên', chỉ có kí tự chuỗi, không có kí tự đặc biệt).
Ví dụ một số tiêu đề: 
Giải tích vi phân.
Phương pháp học hiệu quả.
Lịch trình học tập hôm nay.
Kiến thức lập trình cơ bản.
Ôn tập môn Toán.
Hướng dẫn giải bài tập khó.
Phương pháp nghiên cứu khoa học."
"""
    try:        
        clientOpenai = get_llmTitle()
        response = clientOpenai.complete(f"{system_str} {prompt} Tóm tắt:")
        return str(response)
    except Exception as e:
        print(f"Error during GPT generation: {str(e)}")
        return f"Error: {str(e)}"
  
@router.post("/")
async def create_chat_stream(request: Request):
    body = await request.json()
    question = body.get("text")
    user_id = body.get("userId")

    if not user_id:
        raise HTTPException(status_code=400, detail="User authentication is required.")
    if not question:
        raise HTTPException(status_code=400, detail="Chat content is required.")

    gpt_response_parts = []
    async for token in get_answer_stream(question, user_id=user_id, chat_id=None):
        if token and not token.startswith("Error:"):
            gpt_response_parts.append(token)
        else:
            print(f"Skipped invalid token: {token}")
        
        gpt_response = "".join(gpt_response_parts)

    # Tạo history items với _id
    user_message = HistoryItem(
        role=Role.USER,
        parts=[Part(text=question, _id=str(ObjectId()))],
        _id=str(ObjectId())
    )
    
    model_message = HistoryItem(
        role=Role.MODEL,
        parts=[Part(text=gpt_response, _id=str(ObjectId()))],
        _id=str(ObjectId())
    )

    new_chat = Chat(
        user=user_id,
        history=[user_message, model_message],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        __v=0
    )

    result = chat_collection.insert_one(new_chat.dict(by_alias=True))
    chat_id = str(result.inserted_id)
    
    # Generate a title for the chat using GPT
    title_prompt = f"học viên: {question} trợ giảng: {gpt_response}"
    title = await generate_gpt_response(title_prompt)
    print(title)

    # Update or create user's chat list
    user_chats = user_chats_collection.find_one({"user": user_id})
    chat_entry = {
        "_id": str(result.inserted_id),
        "title": str(title).strip('"'),
        "created_at": datetime.utcnow(),
    }
    if not user_chats:
        user_chats_collection.insert_one({
            "user": user_id,
            "chats": [chat_entry],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        })
    else:
        user_chats_collection.update_one(
            {"user": user_id},
            {"$push": {"chats": chat_entry}, "$set": {"updated_at": datetime.utcnow()}},
        )
    print(result.inserted_id)

    return {"chatId": chat_id}

@router.put("/{chat_id}", response_class=StreamingResponse)
async def add_question_stream(chat_id: str, request: Request):
    body = await request.json()
    question = body.get("question")
    user_id = body.get("userId")
    add = body.get("add")

    if not user_id:
        raise HTTPException(status_code=400, detail="User authentication is required.")
    if not question:
        raise HTTPException(status_code=400, detail="Question content is required.")
    
    async def event_stream():
        gpt_response = ""
        gpt_response_parts = []
        time_start = time.time()
        async for token in get_answer_stream(question, user_id=user_id, chat_id=chat_id):
            if token and not token.startswith("Error:"):
                time_end = time.time()
                gpt_response_parts.append(token)
                yield f"{token} "
            else:
                print(f"Skipped invalid token: {token}")
            
            gpt_response = "".join(gpt_response_parts)

        print("final answer: " + gpt_response)
        if not add:
            # Tạo history items với _id
            user_message = HistoryItem(
                role=Role.USER,
                parts=[Part(text=question, _id=str(ObjectId()))],
                _id=str(ObjectId())
            )
            
            model_message = HistoryItem(
                role=Role.MODEL,
                parts=[Part(text=gpt_response, _id=str(ObjectId()))],
                _id=str(ObjectId())
            )

            result = chat_collection.update_one(
                {"_id": ObjectId(chat_id), "user": user_id},
                {
                    "$push": {"history": {"$each": [user_message.dict(), model_message.dict()]}},
                    "$set": {"updated_at": datetime.utcnow()}
                },
            )
        else:
            model_message = HistoryItem(
                role=Role.MODEL,
                parts=[Part(text=gpt_response, _id=str(ObjectId()))],
                _id=str(ObjectId())
            )
            
            result = chat_collection.update_one(
                {"_id": ObjectId(chat_id), "user": user_id},
                {
                    "$push": {"history": model_message.dict()},
                    "$set": {"updated_at": datetime.utcnow()}
                },
            )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found.")

    return StreamingResponse(event_stream(), media_type="text/plain")
