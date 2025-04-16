# backend/config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PORT = int(os.getenv("PORT", 5000))
