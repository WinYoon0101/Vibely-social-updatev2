from datetime import date, time

from llama_index.core.tools import FunctionTool
from llama_index.core.vector_stores import (
    VectorStoreInfo,
    MetadataInfo,
    MetadataFilter,
    MetadataFilters,
    FilterCondition,
    FilterOperator,
)
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.llms.openai import OpenAI
from llama_index.core.retrievers import VectorIndexAutoRetriever
from llama_index.core import Settings
import weaviate

from fastapi import Depends
from llama_index.core import Settings
import csv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.weaviate import WeaviateVectorStore
from IPython.display import Markdown, display
from fastapi import Depends
from typing import List, Tuple, Any
from pydantic import BaseModel, Field
import datetime
import yaml
from core.ai.database.chat_history_service import get_schedule
import os
# core/ai/tools/tools.py
from llm_integration.huggingface_client import get_embed_model
from llm_integration.weaviate_client import get_weaviate_client
from llm_integration.openai_client import get_llmRetriever
from llama_index.core.response.notebook_utils import display_source_node
import csv


Settings.embed_model = get_embed_model()

# hardcode top k for now
top_k = 5

client = get_weaviate_client()

# define vector store info describing schema of vector store
vector_store_co_the_info = VectorStoreInfo(
    content_info="Chứa những thông tin về cơ thể của người, bao gồm cân nặng, chiều cao, BMI, chỉ số máu và chế độ ăn uống, tập thể dục hợp lý",
    metadata_info=[
        MetadataInfo(
            name="title",
            type="str",
            description=(
                "Tiêu đề của tài liệu chứa thông tin, có thể là cân nặng, chiều cao, BMI, máu hoặc chế độ ăn uống, tập thể dục"
            ),
        ),
        MetadataInfo(
            name="document_title",
            type="str",
            description=(
                "Chủ đề của thông tin"
            ),
        ),
        MetadataInfo(
            name="questions_this_excerpt_can_answer",
            type="str",
            description=(
                "Câu hỏi tham khảo mà đoạn văn này có thể trả lời"
            ),
        ),
        MetadataInfo(
            name="date",
            type="str",
            description=(
                "Ngày tháng năm thông tin được cập nhật"
            ),
        ),
        MetadataInfo(
            name="tags",
            type="str",
            description=(
                "Các từ khóa liên quan đến thông tin"
            ),
        ),
        MetadataInfo(
            name="source",
            type="str",
            description=(
                "Nguồn thông tin có thể là một đường dẫn hoặc tên trang web"
            ),
        ),
    ],
)


def write_to_next_empty_row(data, file_name="tools_log.csv"):
    with open(file_name, mode="a", newline="", encoding="utf-16") as file:
        writer = csv.writer(file)
        writer.writerow(data)  # Append the row to the end of the file

def RetrieveLifeBMIBloodTool(query: str = None, embed_model = Depends(get_embed_model)) :
    """
    Hàm truy vấn thông tin về lịch sử BMI và máu, lối sống khỏe mạnh
    """
    # Define the vector store

    vector_store = WeaviateVectorStore(
        weaviate_client=client, index_name="Cac_chi_so_co_the_BMI", text_key="content"
    )

    loaded_index = VectorStoreIndex.from_vector_store(vector_store)
    
    """Auto retrieval function.

    Performs auto-retrieval from a vector database, and then applies a set of filters.

    """
    query = query or "Query"

    llm = get_llmRetriever()
    
    retriever = VectorIndexAutoRetriever(
        loaded_index,
        vector_store_info=vector_store_co_the_info,
        llm = llm,
        vector_store_query_mode="hybrid", 
        alpha=0.5,
        similarity_top_k = top_k, 
        enable_reranking=True,
    )

    response = retriever.retrieve(query)
        
    # Format response as a string with text, source, and date
    formatted_strings = []
    
    for i, item in enumerate(response):
        text = item.text
        source = (item.metadata.get("source") or item.metadata.get("src_url") or "Không rõ nguồn")# Lấy source từ metadata
        date = item.metadata.get("date", "Không rõ ngày")       # Lấy date từ metadata
        
        # Định dạng chuỗi
        formatted_string = f"{i + 1}. {text} (Nguồn: {source}, Ngày cập nhật: {date})"
        formatted_strings.append(formatted_string)

    # Kết quả là danh sách các chuỗi định dạng
    result = "\n".join(formatted_strings)
    
    # write_to_next_empty_row(["RetrieveLifeBloodTool", result])
    return result

def RetrieveQuestionAnswer(query: str = None, embed_model = Depends(get_embed_model)) :
    """
    Hàm truy vấn các câu hỏi đã được trả lời trước đó
    """
    # Define the vector store

    vector_store = WeaviateVectorStore(
        weaviate_client=client, index_name="Question_Answer", text_key="content"
    )

    loaded_index = VectorStoreIndex.from_vector_store(vector_store)
    
    """Auto retrieval function.

    Performs auto-retrieval from a vector database, and then applies a set of filters.

    """
    query = query or "Query"

    llm = get_llmRetriever()
    
    retriever = VectorIndexAutoRetriever(
        loaded_index,
        vector_store_info=vector_store_co_the_info,
        llm = llm,
        vector_store_query_mode="hybrid", 
        alpha=0.5,
        similarity_top_k = top_k, 
        enable_reranking=True,
    )

    response = retriever.retrieve(query)
    
    
    # Format response as a string with text, source, and date
    formatted_strings = []

    for i, item in enumerate(response):
        text = item.text
        source = (item.metadata.get("source") or item.metadata.get("src_url") or "Không rõ nguồn")# Lấy source từ metadata
        date = item.metadata.get("date", "Không rõ ngày")       # Lấy date từ metadata
        
        # Định dạng chuỗi
        formatted_string = f"{i + 1}. {text} (Nguồn: {source}, Ngày cập nhật: {date})"
        formatted_strings.append(formatted_string)

    # Kết quả là danh sách các chuỗi định dạng
    result = "\n".join(formatted_strings)
    
    #write_to_next_empty_row(["RetrieveQuestionAnswer", result])
    return result

def RetrieveBenhNoiKhoa(query: str = None, embed_model = Depends(get_embed_model)) :
    """
    Truy vấn thông tin về bệnh nội khoa gồm triệu chứng, chẩn đoán và phòng ngừa
    """
    # Define the vector store

    vector_store = WeaviateVectorStore(
        weaviate_client=client, index_name="Benh_noi_khoa", text_key="content"
    )

    loaded_index = VectorStoreIndex.from_vector_store(vector_store)
    
    """Auto retrieval function.

    Performs auto-retrieval from a vector database, and then applies a set of filters.

    """
    query = query or "Query"

    llm = get_llmRetriever()
    
    retriever = VectorIndexAutoRetriever(
        loaded_index,
        vector_store_info=vector_store_co_the_info,
        llm = llm,
        vector_store_query_mode="hybrid", 
        alpha=0.5,
        similarity_top_k = top_k, 
        enable_reranking=True,
    )

    response = retriever.retrieve(query)

        # Format response as a string with text, source, and date
    formatted_strings = []
    
    for i, item in enumerate(response):
        text = item.text
        source = (item.metadata.get("source") or item.metadata.get("src_url") or "Không rõ nguồn")# Lấy source từ metadata
        date = item.metadata.get("date", "Không rõ ngày")       # Lấy date từ metadata
        
        # Định dạng chuỗi
        formatted_string = f"{i + 1}. {text} (Nguồn: {source}, Ngày cập nhật: {date})"
        formatted_strings.append(formatted_string)

    # Kết quả là danh sách các chuỗi định dạng
    result = "\n".join(formatted_strings)
    
    #write_to_next_empty_row(["RetrieveLifeBloodTool", result])
    
    return result

def RetrieveTamLy(query: str = None, embed_model = Depends(get_embed_model)) :
    """
    Hàm truy vấn các câu hỏi về tâm lý học đường
    """
    # Define the vector store

    vector_store = WeaviateVectorStore(
        weaviate_client=client, index_name="Tam_li_hoc_duong", text_key="content"
    )

    loaded_index = VectorStoreIndex.from_vector_store(vector_store)
    
    """Auto retrieval function.

    Performs auto-retrieval from a vector database, and then applies a set of filters.

    """
    query = query or "Query"

    llm = get_llmRetriever()
    
    retriever = VectorIndexAutoRetriever(
        loaded_index,
        vector_store_info=vector_store_co_the_info,
        llm = llm,
        vector_store_query_mode="hybrid", 
        alpha=0.5,
        similarity_top_k = top_k, 
        enable_reranking=True,
    )

    response = retriever.retrieve(query)
    
    
    # Format response as a string with text, source, and date
    formatted_strings = []
    
    for i, item in enumerate(response):
        text = item.text
        source = (item.metadata.get("source") or item.metadata.get("src_url") or "Không rõ nguồn")# Lấy source từ metadata
        date = item.metadata.get("date", "Không rõ ngày")       # Lấy date từ metadata
        
        # Định dạng chuỗi
        formatted_string = f"{i + 1}. {text} (Nguồn: {source}, Ngày cập nhật: {date})"
        formatted_strings.append(formatted_string)

    # Kết quả là danh sách các chuỗi định dạng
    result = "\n".join(formatted_strings)
    
    #write_to_next_empty_row(["RetrieveTamLy", result])
    
    return result

def RetrieveDinhDuong(query: str = None, embed_model = Depends(get_embed_model)) :
    """
    Hàm truy vấn các câu hỏi về dinh dưỡng, thức ăn
    """
    # Define the vector store

    vector_store = WeaviateVectorStore(
        weaviate_client=client, index_name="Dinh_duong", text_key="content"
    )

    loaded_index = VectorStoreIndex.from_vector_store(vector_store)
    
    """Auto retrieval function.

    Performs auto-retrieval from a vector database, and then applies a set of filters.

    """
    query = query or "Query"

    llm = get_llmRetriever()
    
    retriever = VectorIndexAutoRetriever(
        loaded_index,
        vector_store_info=vector_store_co_the_info,
        llm = llm,
        vector_store_query_mode="hybrid", 
        alpha=0.5,
        similarity_top_k = top_k, 
        enable_reranking=True,
    )

    response = retriever.retrieve(query)
    
    
    # Format response as a string with text, source, and date
    formatted_strings = []
    
    for i, item in enumerate(response):
        text = item.text
        source = (item.metadata.get("source") or item.metadata.get("src_url") or "Không rõ nguồn")# Lấy source từ metadata
        date = item.metadata.get("date", "Không rõ ngày")       # Lấy date từ metadata
        
        # Định dạng chuỗi
        formatted_string = f"{i + 1}. {text} (Nguồn: {source}, Ngày cập nhật: {date})"
        formatted_strings.append(formatted_string)

    # Kết quả là danh sách các chuỗi định dạng
    result = "\n".join(formatted_strings)
    
    #write_to_next_empty_row(["RetrieveDinhDuong", result])
    
    return result

def RetrieveMongoTool(
    query: str,
    filter_start_date: date,
    filter_start_time: time,
    filter_end_date: date,
    filter_end_time: time,
    user_id: str,
    ) -> List[dict]:
    """
    Lọc lịch trình dựa trên các tiêu chí từ ScheduleRetrieveModel
    Args:
        query (str): Câu truy vấn (không sử dụng trong hàm này)
        filter_start_date (date): Ngày bắt đầu cần lọc
        filter_start_time (time): Giờ bắt đầu cần lọc
        filter_end_date (date): Ngày kết thúc cần lọc
        filter_end_time (time): Giờ kết thúc cần lọc
        user_id (str): ID của người dùng
    Returns:
        List[dict]: Lịch trình đã lọc
    """
    # Validation đầu vào
    if not user_id:
        print("Warning: user_id is empty or None")
        return []
        
    try:
        # Chuyển đổi date và time thành string để phù hợp với hàm get_schedule
        start_date_str = filter_start_date.strftime('%Y-%m-%d')
        start_time_str = filter_start_time.strftime('%H:%M')
        end_date_str = filter_end_date.strftime('%Y-%m-%d')
        end_time_str = filter_end_time.strftime('%H:%M')
        
        return get_schedule(user_id, start_date_str, start_time_str, end_date_str, end_time_str)
    except Exception as e:
        print(f"Error in RetrieveMongoTool: {e}")
        return []