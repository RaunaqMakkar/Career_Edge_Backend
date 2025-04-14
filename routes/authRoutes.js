// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Fix the path to the User model - check if it's in models/User.js or models/user.js
const User = require("../models/user"); // Changed from User to user (lowercase)

// Define POST /signup endpoint
router.post("/signup", async (req, res) => {
  // If you still want to use the controller function
  try {
    const { signup } = require("../controllers/authController");
    return signup(req, res);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Define POST /login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    // Find the user
    const user = await User.findOne({ email: req.body.email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Send response
    console.log('Login successful, sending token');
    res.json({
      success: true,
      token,
      role: user.role,
      menteeId: user.role === 'mentee' ? user._id : null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
