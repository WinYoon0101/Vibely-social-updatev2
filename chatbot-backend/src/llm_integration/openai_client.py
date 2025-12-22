from llama_index.llms.openai import OpenAI
import yaml
import os 
import openai

# Load file yaml
def load_config():
    # Lấy đường dẫn đến thư mục gốc của dự án (chatbot-backend)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    config_path = os.path.join(base_dir, "configs", "api_key.yaml")
    config_path = os.path.abspath(config_path)  # resolve đường dẫn tuyệt đối

    # Đọc file yaml
    with open(config_path, "r") as file:
        return yaml.safe_load(file)

# Tải API key từ file yaml
config = load_config()
openai.api_key = config["openai"]["api_key"]

# Khởi tạo các model LLM từ OpenAI với các thông số khác nhau để xử lý các tác vụ khác nhau
llmTitle = OpenAI(        
        temperature=0.2,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])

llmAgent = OpenAI(
        temperature=0.1,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])

llmRetriever = OpenAI(
        temperature=0,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])

llmTransform = OpenAI(
        temperature=0.2,
        model="gpt-4o-mini",
        api_key=config["openai"]["api_key"])

# Các hàm getter để lấy các model LLM khi cần
def get_llmTitle():
    return llmTitle

def get_llmAgent():
    return llmAgent

def get_llmRetriever():
    return llmRetriever

def get_llmTransform():
    return llmTransform