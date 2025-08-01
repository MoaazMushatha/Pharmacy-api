const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    //في هنا مشكلة في الربط مع الدتا بيز بكون 
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
