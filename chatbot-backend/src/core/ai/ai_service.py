import json
import yaml
import os
import csv
import time as tm
from datetime import date, time, datetime
import nest_asyncio
from typing import Sequence, List
from openai.types.chat import ChatCompletionMessageToolCall
from llama_index.llms.openai import OpenAI
from llama_index.agent.openai import OpenAIAgent

from llama_index.core.llms import ChatMessage
from llama_index.core.tools import BaseTool, FunctionTool
from openai.types.chat import ChatCompletionMessageToolCall
from llama_index.core import PromptTemplate
from functools import partial
from typing import List, Tuple, Any
from pydantic import BaseModel, Field

from core.ai.database.chat_history_service import get_recent_chat_history, format_chat_history, get_user_info
from prompts.prompt_templates import prompt_template
from prompts.system_prompts import system_prompt
from llm_integration.openai_client import get_llmAgent, get_llmTransform

nest_asyncio.apply()

# Load YAML configuration file
def load_config(config_file=None):
    if config_file is None:
        # Lấy đường dẫn đến thư mục gốc của dự án (chatbot-backend)
        import os
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        config_file = os.path.join(base_dir, "configs", "api_key.yaml")
    
    # Đọc file yaml
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Check and write to the next empty row
def write_to_next_empty_row(data, file_name):
    with open(file_name, mode="a", newline="", encoding="utf-16") as file:
        writer = csv.writer(file, quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(data)

template = prompt_template()

# Load YAML configuration file
config = load_config()
os.environ["OPENAI_API_KEY"] = config["openai"]["api_key"]
OPENAI_API_KEY = config["openai"]["api_key"]

async def get_answer_stream(question: str, chat_id: str, user_id: str):
    """
    Hàm lấy câu trả lời dạng stream cho một câu hỏi
    
    Quy trình xử lý:
    1. Khởi tạo agent với GPT-4o-mini
    2. Lấy lịch sử chat gần đây
    3. Gọi agent để xử lý câu hỏi
    4. Stream từng phần của câu trả lời về client
    5. Lưu câu trả lời hoàn chỉnh vào database
    
    Args:
        question (str): Câu hỏi của người dùng
        chat_id (str): ID phiên chat
        user_id (str): ID người dùng
        
    Returns:
        AsyncGenerator[str, None]: Generator trả về từng phần của câu trả lời
    """
    write_to_next_empty_row([question,"text"], "tools_log.csv")
    
    chat = get_llmAgent()
    
    get_system_prompt = system_prompt()
    
    # Khởi tạo agent với GPT-4o-mini
    agent = OpenAIAgent.from_tools(
        [],  # Không sử dụng tools
        llm=chat,
        verbose=True,
        system_prompt=get_system_prompt,
        api_key=OPENAI_API_KEY,
    )

    query_gen_str = """\
Bạn là một trợ lý học tập hữu ích, có nhiệm vụ tạo ra nhiều câu truy vấn tìm kiếm dựa trên một truy vấn đầu vào (câu input có thể khó hiểu và sai chính tả, nhập sai kí tự). 
Hãy tạo ra {num_queries} truy vấn tìm kiếm (dễ hiểu, dễ truy vấn, khắc phụ các lỗi sai), mỗi truy vấn trên một dòng, liên quan (cùng nghĩa) đến truy vấn đầu vào sau đây, chú ý câu quan trọng ở cuối đoạn:
Query: {query}
Queries:
    """
    query_gen_prompt = PromptTemplate(query_gen_str)

    llm = get_llmTransform()

    # Lấy lịch sử chat gần đây
    history = get_recent_chat_history(chat_id)
    chat_history = format_chat_history(history)
    user_info = get_user_info(user_id)
    
    def generate_queries(query: str, llm, num_queries: int = 3):
        response = llm.predict(
            query_gen_prompt, num_queries=num_queries, query=query
        )
        # assume LLM proper put each query on a newline
        queries = response.split("\n")
        return queries
    
    queries = generate_queries(question, llm)
    
    prompt = PromptTemplate(
        template=template, 
        function_mappings={
            "formatted_history":  lambda: str(chat_history),
            "formatted_user": lambda: str(user_info),
            "question": lambda: question,
            "similar_question": lambda: "\n".join(queries),
        }
    )
    # Tạo nội dung hoàn chỉnh bằng cách gọi các hàm trong `function_mappings`
    rendered_prompt = prompt.template.format(
        formatted_history=prompt.function_mappings["formatted_history"](),
        formatted_user=prompt.function_mappings["formatted_user"](),
        question=prompt.function_mappings["question"](),
        similar_question=prompt.function_mappings["similar_question"](),
    )
    
    start_time=tm.time()
    response = agent.stream_chat(rendered_prompt)
    end_time=tm.time()
    
    elapsed_time=end_time-start_time
    response_gen = response.response_gen
    # Stream từng phần của câu trả lời
    gpt_response_parts = []
    for token in response_gen:
        yield token
        gpt_response_parts.append(token)
        gpt_response = "".join(gpt_response_parts)

if __name__ == "__main__":
    import asyncio
    
    async def test():
        async for event in get_answer_stream("hi", "test-session", "user-id"):
            print('event:', event)
        print('done')

    asyncio.run(test())