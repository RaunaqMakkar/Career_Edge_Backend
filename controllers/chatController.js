// BackEnd/controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received message:", message);
    
    // Initialize the model - Using gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the content in the correct format
    const content = {
      contents: [{
        parts: [{ text: `You are a helpful career guidance assistant. Provide advice on career paths, 
        job searching, resume building, interview preparation, and professional development. 
        Be supportive, informative, and concise in your responses.
        
        User query: ${message}` }]
      }]
    };

    // Generate content
    const result = await model.generateContent(content.contents[0].parts);
    const response = result.response.text();
    
    console.log("Response generated successfully");

    // Send the response back to the client
    res.json({ 
      response: response,
      reply: response // For backward compatibility
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      error: "Failed to get AI response", 
      details: error.message 
    });
  }
};