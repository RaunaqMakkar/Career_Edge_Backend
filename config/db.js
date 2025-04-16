// config/db.js
const mongoose = require('mongoose');

let cachedDb = null;
let isConnected = false;

const connectToDatabase = async () => {
  if (cachedDb && isConnected) return cachedDb;

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      bufferCommands: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    };

    console.log('Connecting to MongoDB...');
    const client = await mongoose.connect(process.env.MONGO_URI, options);
    cachedDb = client;
    isConnected = true;
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    return null;
  }
};

module.exports = connectToDatabase;
