// BackEnd/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT_SECRET used:", process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debugging
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Not authorized, token failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};


module.exports = { protect };

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




