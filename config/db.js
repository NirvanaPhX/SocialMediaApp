const mongoose = require("mongoose");
const config = require("config");

const mongoURI = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully...");
  } catch (err) {
    console.error(err);
    // Exit process with error
    process.exit(1);
  }
};

module.exports = connectDB;
