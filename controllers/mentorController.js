// BackEnd/controllers/mentorController.js
const Mentor = require("../models/mentor");

exports.createMentor = async (req, res) => {
  try {
    const { user, expertise, skills, availability, bio, experience, rates } = req.body;
    const mentor = new Mentor({ user, expertise, skills, availability, bio, experience, rates });
    await mentor.save();
    res.status(201).json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all mentors
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({}).populate("user", "name email role");
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a mentor by ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate("user", "name email role");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update mentor details
exports.updateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    mentor.expertise = req.body.expertise || mentor.expertise;
    mentor.skills = req.body.skills || mentor.skills;
    mentor.availability = req.body.availability || mentor.availability;
    mentor.bio = req.body.bio || mentor.bio;
    mentor.experience = req.body.experience || mentor.experience;
    mentor.rates = req.body.rates || mentor.rates;
    
    const updatedMentor = await mentor.save();
    res.json(updatedMentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
