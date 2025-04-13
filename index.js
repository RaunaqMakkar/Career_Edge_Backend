const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://career-edge-frontend.vercel.app' 
    : 'http://localhost:3000',
  credentials: true
}));

// Other middleware like express.json(), etc.
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const menteeRoutes = require('./routes/menteeRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const matchmakingRoutes = require('./routes/matchmakingRoutes');
const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);

// Handle Python Flask routes
app.post('/api/chat', (req, res) => {
  // Since we can't run Flask on Vercel, we'll need to implement the chat functionality directly in Node.js
  // or use a serverless function approach
  res.json({ message: 'Chat functionality is being migrated to Node.js for Vercel deployment' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Career Edge API is running' });
});

// Connect to MongoDB for production
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected for production');
      // For Vercel serverless deployment, we don't need to explicitly listen
      // as Vercel will handle the HTTP requests
    })
    .catch(err => console.error('MongoDB Connection Error:', err));
}

// Make sure you have this for local development
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected for development');
      app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
      });
    })
    .catch(err => console.error('MongoDB Connection Error:', err));
}

// This is important for Vercel deployment
module.exports = app;