const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// MongoDB connection with optimized settings for serverless environment
let cachedDb = null;
let isConnected = false;

async function connectToDatabase() {
  if (cachedDb && isConnected) {
    return cachedDb;
  }
  
  try {
    // Connection options optimized for serverless
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout for Vercel
      // These settings help with Vercel's serverless functions
      bufferCommands: true, // Changed to true to allow buffering commands
      maxPoolSize: 10, // Limit number of connections in the pool
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority'
    };

    console.log('Attempting to connect to MongoDB...');
    const client = await mongoose.connect(process.env.MONGO_URI, options);
    cachedDb = client;
    isConnected = true;
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Don't throw the error - handle it gracefully
    return null;
  }
}

const app = express();

// Add middleware to ensure database connection before processing requests
// Modify the middleware to ensure connection is complete
app.use(async (req, res, next) => {
  try {
    // Ensure we have a database connection for each request
    await connectToDatabase();
    if (!isConnected) {
      return res.status(500).json({ error: 'Database connection not established' });
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: '*', // Allow all origins temporarily for debugging
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
// const connectionRoutes = require('./routes/connectionRoutes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/connections', connectionRoutes);

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

// Add error handling middleware (should be after routes)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Connect to MongoDB - works for both production and development
connectToDatabase()
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Only start the server in development mode
      app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
      });
    }
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
  });

// This is important for Vercel deployment
module.exports = app;