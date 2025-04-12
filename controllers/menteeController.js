const Mentee = require("../models/mentee");

// Get all mentees
exports.getAllMentees = async (req, res) => {
  try {
    const mentees = await Mentee.find({}).populate("user", "name email role");
    res.json(mentees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a mentee by ID
exports.getMenteeById = async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.params.id).populate("user", "name email role");
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }
    res.json(mentee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update mentee details
exports.updateMentee = async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.params.id);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    // Update fields that might be in the request body
    mentee.interests = req.body.interests || mentee.interests;
    mentee.goals = req.body.goals || mentee.goals;
    // NEW FIELD:
    mentee.preferredSkills = req.body.preferredSkills || mentee.preferredSkills;

    await mentee.save();
    return res.json(mentee);
  } catch (error) {
    console.error("Error updating mentee:", error);
    return res.status(500).json({ message: error.message });
  }
};
