import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# Thay thế YOUR_FILE_ID bằng ID file sau khi upload
response = openai.FineTuningJob.create(
    training_file="YOUR_FILE_ID",
    model="gpt-4o-mini"
)

print(response) 