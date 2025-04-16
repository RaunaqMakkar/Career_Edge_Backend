// BackEnd/controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a chat with Gemini API
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received message:", message);
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    // Add career guidance context
    const careerContext = "You are a helpful career guidance assistant. Provide advice on career paths, job searching, resume building, interview preparation, and professional development. Be supportive, informative, and concise.";
    
    // Send the message to the model
    const result = await chat.sendMessage(careerContext + "\n\nUser query: " + message);
    const reply = result.response.text();
    
    console.log("AI response generated successfully");
    
    // Send the response back to the client
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ 
      error: "Failed to get AI response", 
      details: error.message 
    });
  }
};