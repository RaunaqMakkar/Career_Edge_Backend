# backend/controllers/chat_controller.py
from google import genai
from config import GEMINI_API_KEY

# Initialize the Gemini client using your API key
client = genai.Client(api_key=GEMINI_API_KEY)

def chat_with_gemini(user_message):
    """
    Sends a request to the Gemini API using the generate_content method and returns the response text.
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # Adjust to the correct model name if necessary
            contents=user_message
        )
        return response.text
    except Exception as e:
        print("Gemini API error:", e)
        raise e
