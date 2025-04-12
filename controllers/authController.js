// controllers/authController.js
const User = require("../models/user");
const Mentor = require("../models/mentor");   // Import Mentor model
const Mentee = require("../models/mentee");     // Import Mentee model
const generateToken = require("../utils/generateToken");

// Register new user
exports.signup = async (req, res) => {
  const { name, email, password, role, expertise } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create user document
    const user = await User.create({ name, email, password, role });

    // Normalize role value and create associated mentor/mentee record
    const userRole = role.trim().toLowerCase();
    if (userRole === "mentor") {
      await Mentor.create({
        user: user._id,
        expertise: expertise || "Not provided",
        skills: []
      });
    }
    // In your authController.js signup (example):
    if (userRole === "mentee") {
      const newMentee = await Mentee.create({ user: user._id, interests: [], goals: "" });
      // Return the mentee ID along with user info
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        menteeId: newMentee._id
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      let menteeId = null;
      if (user.role.toLowerCase() === "mentee") {
        // Fetch the mentee document for this user
        const mentee = await Mentee.findOne({ user: user._id });
        if (mentee) {
          menteeId = mentee._id;
        }
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        menteeId,  // Include this for mentees
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

