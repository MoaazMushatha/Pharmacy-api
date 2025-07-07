const { validUpdatePhar, validCreatePhar } = require("../validators/pharmacy");

const Pharmacy = require("../models/Pharmacy");

exports.createPharmacy = async (req, res, next) => {
  //انشاء صيدلية
  const { error } = validCreatePhar(req.body);
  if (error) {
    return next(createError(422, error.message));
    // return res
    //   .status(400)
    //   .json({ errors: error.details.map((d) => d.message) });
  }
  try {
    if (!req.body.name) {
      return next(createError(401, "PharmacyName is required"));

      // return res.status(400).json({ message: "PharmacyName is required" });
    }

    const pharmacy = await Pharmacy.create({
      ...req.body, //انشر
      createdBy: req.user._id, //ربط الصيدلية باليوز الي عملها
    });
    return returnJson(
      res,
      201,
      true,
      "Pharmacy created Successfully تم إنشاء الصيدلية بنجاح!",
      pharmacy
    );

    // res.status(201).json(pharmacy); //if true: return data of pharmacy
  } catch (err) {
    return next(createError(500, err.message));

    // res.status(500).json({ message: err.message });
  }
};

exports.getPharmacies = async (req, res) => {
  //جيب الصيداليات الي في الداتا بيز

  try {
    const pharmacies = await Pharmacy.find({ createdBy: req.user._id }); //هات الصيدليات //retrn is arryay
    return returnJson(
      res,
      201,
      true,
      "pharmacies found Successfully تم جلب الصيدليات بنجاح !",
      pharmacies
    );
    // res.json(pharmacies);
  } catch (err) {
    return next(createError(500, err.message));

    // res.status(500).json({ message: err.message });
  }
};

// update pharm
// const { validUpdatePhar } = require("../validators/pharmacy");

exports.updatePharmacy = async (req, res, next) => {
  const { error } = validUpdatePhar(req.body);
  if (error) {
    return next(createError(422, error.message));
    // return res.status(400).json({
    //   errors: error.details?.map((d) => d.message) || ["حدث خطأ غير معروف في التحقق من البيانات."],
    // });
  }

  try {
    const pharmacy = await Pharmacy.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!pharmacy) {
      return next(createError(404, "الصيدلية غير موجودة"));
      // return res.status(404).json({ message: "لم يتم العثور على الصيدلية." });
    }
    return returnJson(
      res,
      201,
      true,
      "Updata pharmacy in Successfully! تم تحديث بيانات الصيدلية ",
      pharmacy
    );

    // res.json(pharmacy);
  } catch (err) {
    return next(createError(500, err.message));
    // res.status(500).json({ message: "خطأ في الخادم الداخلي." });
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
      return next(createError(404, "Not found pharmacy الصيدلية مش موجودة"));

    // return res
    //   .status(404)
    //   .json({ message: "Not found pharmacy الصيدلية مش موجودة" });

    return returnJson(res, 200, true, "Pharmacy deleted انحذفت", pharmacy);

    // res.json({ message: "Pharmacy deleted انحذفت" });
  } catch (err) {
    return next(createError(500, err.message));

    // res.status(500).json({ message: err.message });
  }
};
