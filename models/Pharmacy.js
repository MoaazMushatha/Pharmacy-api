const mongoose = require("mongoose");

const pharmacySch = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    createdBy: {
      // لربط الصيدلية بالمستخدم الي عملها (auth).
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pharmacy", pharmacySch);
