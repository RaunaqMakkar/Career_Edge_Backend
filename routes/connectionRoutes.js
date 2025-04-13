// BackEnd/routes/connectionRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const {
  createConnectionRequest,
  acceptConnectionRequest,
  getPendingConnectionRequests,
  declineConnectionRequest,
} = require("../controllers/connectionController");

// Mentee sends a connection request
router.post("/", protect, createConnectionRequest);

// Mentor fetches pending connection requests
router.get("/requests", protect, getPendingConnectionRequests);

// Mentor accepts a connection request
router.put("/accept/:requestId", protect, acceptConnectionRequest);

// Mentor declines a connection request
router.put("/decline/:requestId", protect, declineConnectionRequest);

module.exports = router;
