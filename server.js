// BackEnd/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://career-edge-frontend.vercel.app/' 
    : 'http://localhost:3000'
}));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const menteeRoutes = require('./routes/menteeRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const matchmakingRoutes = require('./routes/matchmakingRoutes');
const userRoutes = require('./routes/userRoutes');
// Comment out this line to prevent the error
// const connectionRoutes = require('./routes/connectionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/users', userRoutes);
// Comment out this line as well
// app.use('/api/connections', connectionRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Add this route handler for the root path
app.get('/', (req, res) => {
  res.json({ message: 'Career Edge API is running' });
});
