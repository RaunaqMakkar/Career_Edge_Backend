// BackEnd/utils/calendar.js
const { google } = require("googleapis");

// Create an OAuth2 client with your Google credentials
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set the refresh token (required for service-to-service communication)
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

// Create a calendar instance with our OAuth2 client
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

/**
 * Creates a calendar event for a given appointment.
 * 
 * @param {Object} appointment - The appointment details.
 * @param {string} appointment.appointmentDate - ISO string for appointment start time.
 * @param {string} appointment.message - A description or message for the event.
 * @param {string} appointment.mentorEmail - Email address of the mentor.
 * @param {string} appointment.menteeEmail - Email address of the mentee.
 * @returns {Object} - The created event data.
 */
async function createCalendarEvent(appointment) {
  const event = {
    summary: `Mentorship Session: ${appointment.message}`,
    description: appointment.message,
    start: {
      dateTime: appointment.appointmentDate,
      timeZone: process.env.TIMEZONE || "America/New_York",
    },
    end: {
      // Assume the session lasts 1 hour. Adjust as needed.
      dateTime: new Date(new Date(appointment.appointmentDate).getTime() + 60 * 60 * 1000).toISOString(),
      timeZone: process.env.TIMEZONE || "America/New_York",
    },
    attendees: [
      { email: appointment.mentorEmail },
      { email: appointment.menteeEmail },
    ],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary", // You can change to a specific calendar if needed
      resource: event,
    });
    console.log("Calendar event created:", response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

module.exports = { createCalendarEvent };
