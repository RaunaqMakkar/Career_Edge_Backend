// BackEnd/routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
  getAppointmentsForUser,
} = require("../controllers/appointmentController");

// Create a new appointment (protected)
router.post("/", protect, createAppointment);

// Get all appointments (optional, for testing)
router.get("/", protect, getAllAppointments);

// IMPORTANT: Place /me BEFORE /:id so Express doesn't interpret "me" as an :id param
router.get("/me", protect, getAppointmentsForUser);

// Get a single appointment by ID
router.get("/:id", protect, getAppointmentById);

// Update an appointment
router.put("/:id", protect, updateAppointment);

// Delete an appointment
router.delete("/:id", protect, deleteAppointment);

module.exports = router;
