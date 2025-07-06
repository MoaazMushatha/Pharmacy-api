const express = require("express");
const router = express.Router();

const {
  createPharmacy,
  getPharmacies,
  updatePharmacy,
  deletePharmacy,
} = require("../controllers/pharmacyController");

const auth = require("../middlewares/authMiddleware");

const { validCreatePhar, validUpdatePhar } = require("../validators/pharmacy");

function valCreatePharm(req, res, next) {
  const { error } = validCreatePhar(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map(({ mess }) => mess) });
  }
  next();
}

function valUpdatePharm(req, res, next) {
  const { error } = validUpdatePhar(req.body);

  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map(({ mess }) => mess) });
  }
  next();
}

router.post("/", auth, valCreatePharm, createPharmacy);
// router.post("/", auth, createPharmacy);

router.get("/", auth, getPharmacies);

router.patch("/:id", auth, valUpdatePharm, updatePharmacy);

router.put("/:id", auth, valUpdatePharm, updatePharmacy);

// router.put("/:id", auth, updatePharmacy);

router.delete("/:id", auth, deletePharmacy);

module.exports = router;
