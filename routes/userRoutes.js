// routes/userRoutes.js
console.log("User routes loaded");

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile, // If you want to implement delete
} = require("../controllers/userController");

// Test route to check if user routes are working
router.get("/test", (req, res) => {
  res.send("User routes are working!");
});

router.get("/profile", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET user profile
router.get("/profile", protect, getUserProfile);

// UPDATE user profile
router.put("/profile", protect, updateUserProfile);

// (Optional) DELETE user profile
// If you want to implement the deletion logic, ensure `deleteUserProfile` is defined in userController
router.delete("/profile", protect, deleteUserProfile);

module.exports = router;
