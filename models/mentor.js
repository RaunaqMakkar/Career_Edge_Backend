// BackEnd/models/Mentor.js
const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    expertise: { type: String },
    skills: [{ type: String }],
    availability: { type: String },
    bio: { type: String },
    experience: { type: Number },
    rates: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Mentor || mongoose.model("Mentor", mentorSchema);
