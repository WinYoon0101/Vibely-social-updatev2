from typing import List, Dict, Optional
from datetime import datetime
from pymongo.collection import Collection
from odmantic import AIOEngine
from pymongo import MongoClient
from datetime import datetime
from typing import List
from bson import ObjectId
from pymongo.collection import Collection
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import date, time
import yaml
import pytz  # Để xử lý múi giờ
import csv
import warnings
warnings.filterwarnings("ignore", category=ResourceWarning)

def write_to_next_empty_row(data, file_name="tools_log.csv"):
    with open(file_name, mode="a", newline="", encoding="utf-16") as file:
        writer = csv.writer(file)
        writer.writerow(data)  # Append the row to the end of the file

# Load YAML configuration file
def load_config(config_file=None):
    if config_file is None:
        # Sử dụng đường dẫn tương đối từ thư mục gốc của dự án
        import os
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        config_file = os.path.join(base_dir, "configs", "api_key.yaml")
    
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Load the OpenAI API key from the YAML file
config = load_config()
url=config["mongodb"]["url"]
client = MongoClient(url, connect=False)
db = client["Vibely_study_social_web"]
chat_collection = db["chatbots"]
user_chats_collection = db["userchatbots"]
user_collection = db["users"]
schedule_collection = db["schedules"]
document_collection = db["documents"]
learning_goal_collection = db["learning_goals"]
achievement_collection = db["achievements"]

def get_recent_chat_history(chat_id: str) -> List[dict]:
    """
    Lấy lịch sử chat gần đây của một đoạn chat từ MongoDB.
    
    Args:
        chat_id (str): ID của chat (string representation of MongoDB ObjectId).
        chat_collection (Collection): MongoDB collection instance.
        
    Returns:
        List[dict]: Danh sách các chat (mỗi chat là một dictionary).
    """
    if not chat_id:
        return []
    
    try:
        # Convert chat_id to ObjectId
        object_id = ObjectId(chat_id)
    except Exception as e:
        print(f"Invalid chat_id: {e}")
        return []

    try:
        # Query the collection
        chats = list(
            chat_collection.find({"_id": object_id})
            .sort("created_at", -1)  # Sort by created_at descending
            .limit(4)  # Limit results to the most recent 10
        )
        return chats
    except Exception as e:
        print(f"Error fetching chat history: {e}")
        return []


def format_chat_history(history: List[Dict]) -> List[Dict]:
    """
    Format the chat history into a structured format.
    
    Args:
        history (List[Dict]): List of chat documents retrieved from the database.
        
    Returns:
        List[Dict]: Formatted chat history in chronological order.
    """
    if not history:
        return []

    formatted_history = []

    # Iterate through each chat document in reverse order for chronological history
    for chat in history:
        for message in chat.get("history", []):  # Access 'history' field safely
            role = message.get("role", "unknown")  # Get role (user/model)
            parts = message.get("parts", [])
            # Combine all parts' texts if they exist
            content = " ".join(part.get("text", "") for part in parts)
            formatted_history.append({
                "role": "customer" if role == "user" else "assistant",
                "content": content
            })
    return formatted_history

def get_user_info(user_id: str) -> dict:
    """
    Lấy thông tin người dùng từ database và chỉ bao gồm các trường có giá trị.
    
    Args:
        user_id (str): ID của người dùng.
        
    Returns:
        dict: Thông tin người dùng dưới dạng JSON, chỉ bao gồm các trường có giá trị.
    """
    if not user_id:
        print("Warning: user_id is empty or None")
        return {}
        
    try:
        # Tìm user theo _id
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        
        # Nếu không tìm thấy theo _id, thử tìm theo email
        if not user:
            user = user_collection.find_one({"email": user_id})
            
        if not user:
            print(f"Warning: User not found for user_id: {user_id}")
            return {}

        # Extract and format only fields with values
        fields = ["username", "gender", "dateOfBirth", "email", "bio", "postsCount", "followerCount", "followingCount"]
        formatted_user_info = {field: user[field] for field in fields if field in user and user[field]}
        return formatted_user_info
    except Exception as e:
        print(f"Error fetching user info: {e}")
        return {}

def get_user_documents(user_id: str) -> List[dict]:
    """
    Lấy danh sách tài liệu của user.
    """
    try:
        documents = list(document_collection.find({"user": user_id}))
        return documents
    except Exception as e:
        print(f"Error fetching user documents: {e}")
        return []

def get_user_learning_goals(user_id: str) -> List[dict]:
    """
    Lấy mục tiêu học tập của user.
    """
    try:
        goals = list(learning_goal_collection.find({"user": user_id}))
        return goals
    except Exception as e:
        print(f"Error fetching learning goals: {e}")
        return []

def get_user_achievements(user_id: str) -> List[dict]:
    """
    Lấy thành tích của user.
    """
    try:
        achievements = list(achievement_collection.find({"user": user_id}))
        return achievements
    except Exception as e:
        print(f"Error fetching achievements: {e}")
        return []

def get_schedule(
    user_id: str, 
    filter_start_date: str,  # Ngày bắt đầu (chuỗi kiểu str)
    filter_start_time: str,  # Giờ bắt đầu (chuỗi kiểu str)
    filter_end_date: str,    # Ngày kết thúc (chuỗi kiểu str)
    filter_end_time: str     # Giờ kết thúc (chuỗi kiểu str)
) -> List[Dict]:
    """
    Lấy các hoạt động của người dùng trong khoảng thời gian yêu cầu từ MongoDB.

    Args:
        user_id (str): ID của người dùng.
        filter_start_date (str): Ngày bắt đầu cần lọc (kiểu string, ví dụ '2025-01-21').
        filter_start_time (str): Giờ bắt đầu cần lọc (kiểu string, ví dụ '09:00').
        filter_end_date (str): Ngày kết thúc cần lọc (kiểu string, ví dụ '2025-01-21').
        filter_end_time (str): Giờ kết thúc cần lọc (kiểu string, ví dụ '17:00').  
    Returns:
        List[Dict]: Danh sách các hoạt động trong khoảng thời gian đã lọc.
    """
    # Chuyển chuỗi thành đối tượng date và time
    filter_start_date = datetime.strptime(filter_start_date, '%Y-%m-%d').date()
    filter_end_date = datetime.strptime(filter_end_date, '%Y-%m-%d').date()

    filter_start_time = datetime.strptime(filter_start_time, "%H:%M").time()
    filter_end_time = datetime.strptime(filter_end_time, "%H:%M").time()

    # Kết hợp ngày và thời gian thành datetime đầy đủ
    start_datetime = datetime.combine(filter_start_date, filter_start_time)  # Bắt đầu tại thời gian cụ thể
    end_datetime = datetime.combine(filter_end_date, filter_end_time)        # Kết thúc tại thời gian cụ thể

    # Chuyển đổi datetime sang múi giờ UTC (hoặc múi giờ cần thiết)
    tz = pytz.timezone('UTC')  # Nếu bạn muốn làm việc với UTC, thay đổi múi giờ nếu cần
    start_datetime = tz.localize(start_datetime)
    end_datetime = tz.localize(end_datetime)

    # Xây dựng truy vấn MongoDB để lọc các hoạt động trong khoảng thời gian
    query = {
        "user": user_id,
        "$or": [
            {"startTime": {"$gte": start_datetime, "$lte": end_datetime}},  # Bắt đầu trong khoảng thời gian lọc
            {"endTime": {"$gte": start_datetime, "$lte": end_datetime}},    # Kết thúc trong khoảng thời gian lọc
            {"startTime": {"$lte": start_datetime}, "endTime": {"$gte": end_datetime}}  # Bao phủ toàn bộ khoảng thời gian lọc
        ]
    }

    # Truy vấn MongoDB để lấy các hoạt động
    events = schedule_collection.find(query)

    # Múi giờ UTC+7
    tz_utc_plus_7 = pytz.timezone('Asia/Ho_Chi_Minh')

    # Chuyển đổi kết quả thành danh sách các hoạt động và chuyển về múi giờ UTC+7
    filtered_schedule = []
    for event in events:
        # Lấy thời gian từ MongoDB (giả sử là UTC)
        start_time_utc = event.get("startTime")
        end_time_utc = event.get("endTime")

        # Gắn múi giờ UTC nếu thiếu
        if start_time_utc.tzinfo is None:
            start_time_utc = pytz.utc.localize(start_time_utc)
        if end_time_utc.tzinfo is None:
            end_time_utc = pytz.utc.localize(end_time_utc)

        # Chuyển thời gian UTC về UTC+7
        start_time_local = start_time_utc.astimezone(tz_utc_plus_7)
        end_time_local = end_time_utc.astimezone(tz_utc_plus_7)

        filtered_schedule.append({
            "Chủ đề": event.get("subject", ""),
            "Thời gian bắt đầu (UTC+7)": start_time_local.strftime("%Y-%m-%d %H:%M:%S %Z"),  # Ghi rõ múi giờ
            "Thời gian kết thúc (UTC+7)": end_time_local.strftime("%Y-%m-%d %H:%M:%S %Z"),  # Ghi rõ múi giờ
        })
    # write_to_next_empty_row(["RetrieveMongo", filtered_schedule])
    return filtered_schedule