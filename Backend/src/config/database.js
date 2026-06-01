const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    // Mongoose 6+ uses the new parser and unified topology by default;
    // options `useNewUrlParser` and `useUnifiedTopology` are no longer supported.
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Continue without throwing error in case MongoDB is not running
    // Remove this if you want strict MongoDB requirement
    console.warn('Continuing without MongoDB connection...');
  }
};

module.exports = connectDB;
