from llama_index.vector_stores.weaviate import WeaviateVectorStore
import weaviate
import yaml
import os

# Load file yaml
def load_config(config_file=None):
    if config_file is None:
        # Lấy đường dẫn đến thư mục gốc của dự án (chatbot-backend)
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        config_file = os.path.join(base_dir, "configs", "api_key.yaml")
    
    # Đọc file yaml
    with open(config_file, "r") as file:
        return yaml.safe_load(file)

# Tải API key từ file yaml
config = load_config()

cluster_url = config["weaviate"]["url"]
api_key = config["weaviate"]["api_key"]

weaviate_client = weaviate.connect_to_wcs(
    cluster_url=cluster_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key),
    skip_init_checks=True,
)

def get_weaviate_client () :
    return weaviate_client