//routes/matchMakingRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Mentor = require("../models/mentor");
const Mentee = require("../models/mentee");

/**
 * Calculate Jaccard Similarity for skill/goal matching.
 * @param {string[]} setA - Array of mentee preferred skills (or goal tokens).
 * @param {string[]} setB - Array of mentor skills (or relevant tokens).
 * @returns {number} - Similarity percentage (0 - 100).
 */
function calculateJaccardSimilarity(arrayA, arrayB) {
  const setA = new Set(arrayA);
  const setB = new Set(arrayB);

  const intersection = new Set([...setA].filter((item) => setB.has(item)));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return 0;
  return (intersection.size / union.size) * 100;
}

/**
 * Calculate similarity among multiple factors (skills, experience, goals).
 * Adjust the weighting as needed.
 * @param {string[]} menteeSkills - The mentee's preferred skills array.
 * @param {number} menteeExperience - (Optional) If you store mentee experience.
 * @param {string[]} mentorSkills - The mentor's skills array.
 * @param {number} mentorExperience - The mentor's years of experience.
 * @param {string[]} menteeGoalsTokens - (Optional) tokens from mentee goals.
 * @param {string[]} mentorExpertiseTokens - (Optional) tokens from mentor expertise/bio.
 */
function calculateSimilarity({
  menteeSkills,
  mentorSkills,
  mentorExperience,
  menteeGoalsTokens,
  mentorExpertiseTokens,
}) {
  // Skill similarity using Jaccard
  const skillSimilarity = calculateJaccardSimilarity(menteeSkills, mentorSkills);

  // Experience similarity: assume 10 years is 100%
  const experienceSimilarity = Math.min((mentorExperience / 10) * 100, 100);

  // If you want to incorporate goal similarity (optional):
  let goalSimilarity = 0;
  if (menteeGoalsTokens && mentorExpertiseTokens) {
    goalSimilarity = calculateJaccardSimilarity(menteeGoalsTokens, mentorExpertiseTokens);
  }

  // Weighting: for example:
  // 60% skill, 30% experience, 10% goals
  const skillWeight = 0.6;
  const experienceWeight = 0.3;
  const goalWeight = 0.1;

  const overallSimilarity =
    skillSimilarity * skillWeight +
    experienceSimilarity * experienceWeight +
    goalSimilarity * goalWeight;

  return {
    skillSimilarity: Math.round(skillSimilarity),
    experienceSimilarity: Math.round(experienceSimilarity),
    goalSimilarity: Math.round(goalSimilarity),
    overallSimilarity: Math.round(overallSimilarity),
  };
}

router.get("/", protect, async (req, res) => {
  try {
    // 1) Fetch the mentee doc for the logged-in user
    const mentee = await Mentee.findOne({ user: req.user._id });

    // 2) Extract the mentee's preferredSkills
    const menteeSkills = mentee?.preferredSkills ?? [];

    // 3) (Optional) If you want to factor in "goals" text, split into tokens
    //    For example: "Become a data scientist" -> ["become","a","data","scientist"]
    //    Lowercase them for consistency
    const menteeGoalsTokens = mentee?.goals
      ? mentee.goals.toLowerCase().split(/\s+/)
      : [];

    // 4) Fetch all mentors
    const mentors = await Mentor.find({}).populate("user", "name email role").lean();

    // 5) Build a recommendations array
    const recommendations = mentors.map((mentor) => {
      const mentorSkills = mentor.skills || [];
      const mentorExperience = mentor.experience || 0;

      // (Optional) If you want to factor in mentor’s bio or expertise as tokens
      const mentorExpertiseTokens = mentor.expertise
        ? mentor.expertise.toLowerCase().split(/\s+/)
        : [];

      const similarity = calculateSimilarity({
        menteeSkills,
        mentorSkills,
        mentorExperience,
        menteeGoalsTokens,
        mentorExpertiseTokens,
      });

      return {
        id: mentor._id,
        name: mentor.user?.name || "Unknown",
        expertise: mentor.expertise,
        skills: mentor.skills,
        availability: mentor.availability,
        bio: mentor.bio,
        experience: mentor.experience,
        rates: mentor.rates,
        similarity,
      };
    });

    // 6) Return the array of mentors with similarity scores
    res.json(recommendations);
  } catch (error) {
    console.error("Matchmaking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
