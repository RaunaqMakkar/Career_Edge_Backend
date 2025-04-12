const express = require("express");
const router = express.Router();
const { getAllMentees, getMenteeById, updateMentee } = require("../controllers/menteeController");
const { protect } = require("../middleware/authMiddleware");

// Get all mentees
router.get("/", protect, getAllMentees);

// Get a specific mentee by ID
router.get("/:id", protect, getMenteeById);

// Update mentee details
router.put("/:id", protect, updateMentee);

module.exports = router;
