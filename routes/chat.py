# backend/routes/chat.py
from flask import Blueprint, request, jsonify
from controllers.chat_controller import chat_with_gemini

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        reply = chat_with_gemini(user_message)
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
