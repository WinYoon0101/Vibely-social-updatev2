from sentence_transformers import SentenceTransformer

# Tạo và lưu trữ embed model
embed_model = SentenceTransformer("bkai-foundation-models/vietnamese-bi-encoder")

def get_embed_model():
    return embed_model

embed_model_halong = SentenceTransformer("hiieu/halong_embedding")

def get_embed_model_halong():
    return embed_model_halong