# backend/app.py
from flask import Flask
from routes.chat import chat_bp
from config import PORT

app = Flask(__name__)

# Register the chat blueprint with URL prefix /api
app.register_blueprint(chat_bp, url_prefix="/api")

@app.route("/")
def index():
    return "AI-Powered Chatbot Backend using Gemini is running."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
