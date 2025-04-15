// BackEnd/controllers/appointmentController.js
const Appointment = require("../models/appointment");
const { createCalendarEvent } = require("../utils/calendar");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const { mentor, mentee, appointmentDate, message, mentorEmail, menteeEmail } = req.body;

  try {
    // Save the new appointment
    const appointment = new Appointment({ mentor, mentee, appointmentDate, message });
    await appointment.save();

    // Optionally create a calendar event
    try {
      const calendarEvent = await createCalendarEvent({
        appointmentDate,
        message,
        mentorEmail,
        menteeEmail,
      });
      console.log("Calendar event created:", calendarEvent.htmlLink);
    } catch (calendarError) {
      console.error("Calendar event creation failed:", calendarError);
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments (optional, for testing/admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("mentor", "name email")
      .populate("mentee", "name email");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointments for the logged-in user
exports.getAppointmentsForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Logged-in user ID:", userId, "Type:", typeof userId);
    const query = { $or: [{ mentor: userId }, { mentee: userId }] };
    console.log("Query for appointments:", query);
    const appointments = await Appointment.find(query)
      .populate("mentor", "name email")
      .populate("mentee", "name email");
    console.log("Found appointments:", appointments);
    return res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("mentor", "name email")
      .populate("mentee", "name email");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
