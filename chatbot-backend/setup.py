from setuptools import setup, find_packages

setup(
    name="chatbot-backend",
    version="0.1",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastapi",
        "uvicorn",
        "pymongo",
        "motor",
        "odmantic",
        "python-dotenv",
        "requests",
    ],
) 