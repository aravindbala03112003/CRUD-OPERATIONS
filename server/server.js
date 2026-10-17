require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      console.log('Connected to MongoDB Atlas');
    } else {
      console.warn('WARNING: MONGODB_URI is not set. Please set it in .env');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
