// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// Define POST /signup endpoint
router.post("/signup", signup);

// Define POST /login endpoint
// Add this near your login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    // Your existing login code...
    
    // Before sending response
    console.log('Login response:', { success: true, token, user });
    
    // Send response
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
