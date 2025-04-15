const mongoose = require('mongoose');

// Track connection status
let isConnected = false;
let cachedConnection = null;

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose>} Mongoose connection
 */
const connectToDatabase = async () => {
  // If we already have a connection, return it
  if (isConnected && cachedConnection) {
    return cachedConnection;
  }

  try {
    console.log('Connecting to MongoDB...');
    
    // Updated connection options without deprecated settings
    const options = {
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    };

    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGO_URI, options);
    
    // Update connection status
    isConnected = true;
    cachedConnection = connection;
    
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    isConnected = false;
    cachedConnection = null;
    return null;
  }
};

module.exports = connectToDatabase;