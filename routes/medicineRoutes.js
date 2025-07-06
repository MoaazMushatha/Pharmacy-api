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

const {
  validateCreateMed,
  validateUpdateMed,
} = require("../validators/medicine");

function valCreateMiddl(req, res, next) {
  const { error } = validateCreateMed(req.body);

  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map(({ mess }) => mess) });
  }

  next();
}

function valUpdateMiddl(req, res, next) {
  const { error } = validateUpdateMed(req.body);

  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map(({ mess }) => mess) });
  }

  next();
}

// إضافة دوا جديد مع التحقق وauth
router.post("/", auth, valCreateMiddl, createMedicine);

// إضافة دوا جديد
// router.post("/", auth, createMedicine);

// عرض الادوية مع الفلترة والـ pagination بناء على inStock
router.get("/", getAllMedicines);

router.get("/:id", getMedicineById);

// تعديل دواء مع التحقق وauth
router.put("/:id", auth, valUpdateMiddl, updateMedicine);
// router.put('/:id', auth, updateMedicine);

router.delete("/:id", auth, deleteMedicine);

router.post("/:id/alternatives", auth, addAlternative);

router.put("/:id/alternatives", auth, updateAlternatives);

router.delete("/:id/alternatives/:altId", deleteAlternative);

// إضافة بديل لدواء
// router.post('/', auth, addAlternative);
// router.post("/:id/alternatives", auth, addAlternative);

module.exports = router;
