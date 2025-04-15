const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectToDatabase = require('./config/db');

const app = express();

// CORS
app.use(cors({
  origin: "*",  // For production, replace with specific origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Failed to connect to database' });
    }
    next();
  } catch (err) {
    console.error('Middleware DB Error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const menteeRoutes = require('./routes/menteeRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const matchmakingRoutes = require('./routes/matchmakingRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Career Edge API is running' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Only start the server in development
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  });
}

// Important for Vercel
module.exports = app;
