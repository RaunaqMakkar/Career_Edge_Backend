// BackEnd/models/Mentee.js
const mongoose = require("mongoose");

const menteeSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    interests: [{ type: String }],
    goals: { type: String },
    preferredSkills: [{ type: String }]  // NEW field if needed
  },
  { timestamps: true }
);

// Export the model only if it doesn't already exist.
module.exports = mongoose.models.Mentee || mongoose.model("Mentee", menteeSchema);
