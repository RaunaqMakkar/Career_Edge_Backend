// BackEnd/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/chatController");

// POST /api/chat - Send a message to the AI and get a response
router.post("/", chatWithAI);

module.exports = router;