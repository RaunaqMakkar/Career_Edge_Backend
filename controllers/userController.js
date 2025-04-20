// controllers/userController.js
const User = require("../models/user");

exports.getUserProfile = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Optionally update password if provided (it will be hashed in pre-save hook)
      if (req.body.password) {
        user.password = req.body.password;
      }
      // Additional fields (skills, availability, etc.) can be updated here as well.
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        // Optionally, you can return a new token if needed.
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/userController.js
exports.deleteUserProfile = async (req, res) => {
  try {
    // e.g., find and delete user by req.user._id
    // Also delete associated mentor or mentee record if needed
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "User account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

