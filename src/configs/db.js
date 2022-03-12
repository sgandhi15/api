const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost");
    console.log(`MongoDB is connected to ${conn.connection.host}`);
  } catch (error) {
    console.error({
      error: "Fatal error, please contact site admin for resolution...!",
    });
    process.exit(1);
  }
};
