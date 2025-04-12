// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// Define POST /signup endpoint
router.post("/signup", signup);

// Define POST /login endpoint
router.post("/login", login);

module.exports = router;
