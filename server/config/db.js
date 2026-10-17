const mongoose = require('mongoose');

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB with connection caching for serverless environments.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    };

    cachedConnection.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (error) {
    cachedConnection.promise = null;
    throw error;
  }

  return cachedConnection.conn;
}

module.exports = connectDB;
