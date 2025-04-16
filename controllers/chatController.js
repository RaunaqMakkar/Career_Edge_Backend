// BackEnd/controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message, conversation } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Career guidance context to help the model provide relevant responses
    const careerGuidanceContext = 
      "You are a helpful career guidance assistant. Provide advice on career paths, " +
      "job searching, resume building, interview preparation, and professional development. " +
      "Be supportive, informative, and concise in your responses.";

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "I need career guidance." }],
        },
        {
          role: "model",
          parts: [{ text: "I'd be happy to help with your career questions! What specific aspect of your career would you like guidance on?" }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    // Send the message to the model with the career guidance context
    const result = await chat.sendMessage(careerGuidanceContext + "\n\nUser query: " + message);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ 
      error: "Failed to get AI response", 
      details: error.message 
    });
  }
};