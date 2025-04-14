// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// Define POST /signup endpoint
router.post("/signup", signup);

// Define POST /login endpoint
// Add this to your login route
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
