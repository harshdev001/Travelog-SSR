// connectors/index.js

const mongoose = require('mongoose');

 // Update with your actual MongoDB URL

const connectToMongoDB = async (mongoURI) => {
  try {
    // Connect to MongoDB using the exported URL
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = { connectToMongoDB};
