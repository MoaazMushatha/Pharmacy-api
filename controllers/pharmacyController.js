const { validUpdatePhar, validCreatePhar } = require("../validators/pharmacy");

const Pharmacy = require("../models/Pharmacy");

exports.createPharmacy = async (req, res) => {
  //انشاء صيدلية
  const { error } = validCreatePhar(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((d) => d.message) });
  }

  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "PharmacyName is required" });
    }

    const pharmacy = await Pharmacy.create({
      ...req.body, //انشر
      createdBy: req.user._id, //ربط الصيدلية باليوز الي عملها
    });
    res.status(201).json(pharmacy); //if true: return data of pharmacy
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPharmacies = async (req, res) => {
  //جيب الصيداليات الي في الداتا بيز

  try {
    const pharmacies = await Pharmacy.find({ createdBy: req.user._id }); //هات الصيدليات //retrn is arryay
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update pharm
exports.updatePharmacy = async (req, res) => {
  const { error } = validUpdatePhar(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((d) => d.message) });
  }

  try {
    const pharmacy = await Pharmacy.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },

      req.body,
      { new: true }
    );

    if (!pharmacy) return res.status(404).json({ message: "Not found" });

    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE pharmacy
exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!pharmacy)
      return res
        .status(404)
        .json({ message: "Not found pharmacy الصيدلية مش موجودة" });

    res.json({ message: "Pharmacy deleted انحذفت" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
