const mongoose = require("mongoose");
/**
 * 1. فلترة الأدوية حسب الصيدلية
2. البحث عن دواء باسم معين
3. إضافة خاصية البدائل (بديل دواء أساسي)

 */
const medicineSch = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    brand: String,
    price: { type: Number, required: true },

    inStock: {
      type: Boolean,
      default: true, // الدواء متوفر افتراضيًا
    },

    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },

    availability: Boolean,

    //بديل الدوا
    alternatives: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSch);
