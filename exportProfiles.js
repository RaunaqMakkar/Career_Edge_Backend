// exportProfiles.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

// Import your User, Mentor, and Mentee models
const User = require("./models/user");
const Mentor = require("./models/mentor");
const Mentee = require("./models/mentee");

const exportProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    // Fetch all users
    const users = await User.find({}).lean();

    // Fetch mentor-specific data (if stored separately)
    const mentors = await Mentor.find({}).populate("user", "name email role").lean();

    // Fetch mentee-specific data (if stored separately)
    const mentees = await Mentee.find({}).populate("user", "name email role").lean();

    // Combine profiles by role. You might merge data from User and Mentor/Mentee documents.
    const profiles = {
      mentors: mentors.map((m) => ({
        id: m.user._id, // Using the user ID for matchmaking if needed
        name: m.user.name,
        email: m.user.email,
        role: m.user.role,
        expertise: m.expertise,
        skills: m.skills, // expect an array of skills
        availability: m.availability,
        bio: m.bio,
        experience: m.experience,
        rates: m.rates,
      })),
      mentees: mentees.map((mn) => ({
        id: mn.user._id,
        name: mn.user.name,
        email: mn.user.email,
        role: mn.user.role,
        interests: mn.interests, // expect an array of interests
        goals: mn.goals,
      })),
      // Optionally, include all users not explicitly in Mentor/Mentee
      users: users,
    };

    // Write the profiles to a JSON file for further processing
    fs.writeFileSync("profiles.json", JSON.stringify(profiles, null, 2));
    console.log("Profiles exported to profiles.json");
    process.exit(0);
  } catch (error) {
    console.error("Error exporting profiles:", error);
    process.exit(1);
  }
};

exportProfiles();
