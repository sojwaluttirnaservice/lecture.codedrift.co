const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  if (!mongoUri) return null;
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

module.exports = { connectDB };
