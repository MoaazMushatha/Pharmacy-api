const express = require("express");
const router = express.Router();

const {
  createPharmacy,
  getPharmacies,
  updatePharmacy,
  deletePharmacy,
} = require("../controllers/pharmacyController");

const auth = require("../middlewares/authMiddleware");

router.post("/", auth, createPharmacy);
// router.post("/", auth, createPharmacy);

router.get("/", auth, getPharmacies);

router.patch("/:id", auth, updatePharmacy);

router.put("/:id", auth, updatePharmacy);

// router.put("/:id", auth, updatePharmacy);

router.delete("/:id", auth, deletePharmacy);

module.exports = router;
