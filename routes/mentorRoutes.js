const express = require("express");
const router = express.Router();
const { getAllMentors, getMentorById, updateMentor, createMentor } = require("../controllers/mentorController");
const { protect } = require("../middleware/authMiddleware");

console.log({ getAllMentors, getMentorById, updateMentor, createMentor });

// Get all mentors
router.get("/", protect, getAllMentors);

// Get a specific mentor by ID
router.get("/:id", protect, getMentorById);

// Update mentor details
router.put("/:id", protect, updateMentor);

// Create a mentor
router.post("/", protect, createMentor);

module.exports = router;
