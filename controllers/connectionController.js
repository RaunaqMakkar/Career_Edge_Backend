// BackEnd/controllers/connectionController.js
const ConnectionRequest = require("../models/ConnectionRequest");

// Existing function for creating a connection request
exports.createConnectionRequest = async (req, res) => {
  const { mentorId, message } = req.body;
  const menteeId = req.user._id; // Mentee's ID should be here

  console.log("Mentor ID:", mentorId, "Mentee ID:", menteeId); // Debugging

  try {
    const connectionRequest = new ConnectionRequest({
      mentor: mentorId,
      mentee: menteeId, // Make sure this is the correct mentee ID
      message,
      status: "pending",
    });

    await connectionRequest.save();
    res.status(201).json({ message: "Connection request sent", connectionRequest });
  } catch (error) {
    console.error("Error creating connection request:", error);
    res.status(500).json({ message: error.message });
  }
};

// Existing function for accepting a connection request
exports.acceptConnectionRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await ConnectionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    // Optional: Verify the mentor making the request is the intended recipient
    if (request.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }
    request.status = "accepted";
    await request.save();
    res.json({ message: "Connection request accepted", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Get pending connection requests for the logged-in mentor
exports.getPendingConnectionRequests = async (req, res) => {
  try {
    // Ensure that the logged-in user is a mentor
    // You might have a role property on the user object from the protect middleware
    if (req.user.role.toLowerCase() !== "mentor") {
      return res.status(403).json({ message: "Only mentors can view connection requests" });
    }
    const requests = await ConnectionRequest.find({
      mentor: req.user._id,
      status: "pending",
    })
      .populate("mentee", "name email") // Get basic info about the mentee
      .lean();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Decline a connection request
exports.declineConnectionRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await ConnectionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to decline this request" });
    }
    request.status = "declined";
    await request.save();
    res.json({ message: "Connection request declined", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
