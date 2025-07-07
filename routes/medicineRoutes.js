const express = require("express");
const router = express.Router();

const {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  addAlternative,
  updateAlternatives,
  deleteAlternative,
} = require("../controllers/medicineController");
const auth = require("../middlewares/authMiddleware");

// إضافة دوا جديد مع التحقق وauth
router.post("/", auth, createMedicine);

// إضافة دوا جديد
// router.post("/", auth, createMedicine);

// عرض الادوية مع الفلترة والـ pagination بناء على inStock
router.get("/", auth, getAllMedicines);

router.get("/:id", auth, getMedicineById);

// تعديل دواء مع التحقق وauth
router.put("/:id", auth, updateMedicine);
// router.put('/:id', auth, updateMedicine);

router.delete("/:id", auth, deleteMedicine);

router.post("/:id/alternatives", auth, addAlternative);

router.put("/:id/alternatives", auth, updateAlternatives);

router.delete("/:id/alternatives/:altId", auth, deleteAlternative);

// إضافة بديل لدواء
// router.post('/', auth, addAlternative);
// router.post("/:id/alternatives", auth, addAlternative);

module.exports = router;
