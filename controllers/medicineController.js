const {
  validateCreateMed,
  validateUpdateMed,
} = require("../validators/medicine");

const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");

exports.createMedicine = async (req, res, next) => {
  const { error } = validateCreateMed(req.body);
  if (error) {
    return next(createError(422, error.message));
    // return res.status(400).json({ errors: error.details.map(d => d.message) });
  }

  try {
    const { name, price, pharmacy, description, inStock } = req.body;

    if (!name) {
      return next(
        createError(400, "Medicine name is required اسم الدواء مطلوب")
      );
      // return res.status(400).json({ message: "Medicine name is required" });
    }

    if (!pharmacy) {
      return next(createError(400, "Pharmacy ID is required"));
      // return res.status(400).json({ message: "Pharmacy ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(pharmacy)) {
      return next(createError(400, "Invalid pharmacy ID"));
      // return res.status(400).json({ message: "Invalid pharmacy ID" });
    }

    const pharm = await Pharmacy.findById(pharmacy);
    if (!pharm)
      return next(
        createError(
          404,
          "Pharmacy not found in database لم يتم العثور على الصيدلية"
        )
      );
    // return res
    //   .status(404)
    //   .json({ message: "Pharmacy not found in database" });

    const med = await Medicine.create(
      //اعمل دوا جديد
      req.body // من البيانات الي انا ببعته
    );

    return returnJson(res, 201, true, "تم إنشاء الدواء بنجاح", med);
    // res.status(201).json(med);
  } catch (err) {
    return next(createError(500, err.message));
    // res.status(500).json({ message: err.message });
  }
};

exports.getAllMedicines = async (req, res, next) => {
  //بجيب كل الادوية من الداتا بيز
  const { pharmacyId, name, inStock, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (pharmacyId) filter.pharmacy = pharmacyId; //فلترة بالصيدلية

  if (name)
    //مش caseSestive
    filter.name = { $regex: name, $options: "i" }; //regex فلترة بالاسم

  if (inStock !== undefined) filter.inStock = inStock === "true"; //بحول من string to true

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // if (name) filter.name = new RegExp(name, "i");
  try {
    const total = await Medicine.countDocuments(filter);

    const meds = await Medicine.find(filter)
      .populate("pharmacy", "name address") //جيب تفاصيل الصيدلية الي مربوطة في الدوا
      .populate({
        //جيب الدوا البديل
        path: "alternatives",
        select: "name price inStock",
        populate: {
          path: "pharmacy",
          select: "name address",
        },
      })
      .lean() // يحسّن الأداء بإرجاع plain JS objects
      .skip(skip)
      .limit(parseInt(limit));
    // .skip((page - 1) * limit)
    // .limit(Number(limit));
    // .populate("alternatives",'name price')

    return returnJson(res, 200, true, "تم جلب الأدوية بنجاح", {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: meds,
    });

    // res.json({
    //   total,
    //   page: parseInt(page),
    //   pages: Math.ceil(total / limit),
    //   data: meds,
    // });
  } catch (err) {
    return next(createError(500, err.message));
    // res.status(500).json({ message: err.message });
  }
};
//جيب الدوا من ال id
exports.getMedicineById = async (req, res, next) => {
  try {
    const med = await Medicine.findById(req.params.id)
      .populate("pharmacy", "name address phone") //جيب تفاصيل الصيدلية الي مربوطة في الدوا
      .populate({
        //جيب الدوا البديل
        path: "alternatives",
        select: "name price inStock", //بس الاسم والسعر
        populate: {
          //كمان للدو  البديل جيب الصيدلية الي هو موجود فيها
          path: "pharmacy",
          select: "name address",
        },
      });

    if (!med)
      return next(createError(404, "Medicine not found الدواء غير موجود"));
    // return res.status(404).json({ message: "Medicine not found" });

    return returnJson(res, 200, true, "تم العثور على الدواء", med);
    // res.json(med);
  } catch (err) {
    return next(createError(500, err.message));

    // res.status(500).json({ message: err.message });
  }
};

//تعديل
exports.updateMedicine = async (req, res, next) => {
  const { error } = validateUpdateMed(req.body);
  if (error) {
    return next(createError(422, error.message));
    // return res
    //   .status(400)
    //   .json({ errors: error.details.map((d) => d.message) });
  }

  try {
    const { pharmacy } = req.body;

    //اذا بده يغير الصيدلةة لازم تكون موجودة اصلا
    if (pharmacy) {
      if (!mongoose.Types.ObjectId.isValid(pharmacy)) {
        return next(
          createError(400, "Invalid pharmacy ID معرف الصيدلية غير صالح")
        );
        // return res.status(400).json({ message: "Invalid pharmacy ID" });
      }

      const pharm = await Pharmacy.findById(pharmacy);
      if (!pharm) {
        return next(
          createError(
            404,
            "Pharmacy not found in database لم يتم العثور على الصيدلية"
          )
        );

        // return res
        //   .status(404)
        //   .json({ message: "Pharmacy not found in database" });
      }
    }

    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!med)
      return next(createError(404, "Medicine not found الدواء غير موجود"));
    // return res.status(404).json({ message: "Medicine not found" });

    return returnJson(res, 200, true, "تم تحديث الدواء بنجاح", med);
    // res.json(med);
  } catch (err) {
    return next(createError(500, err.message));
    // res.status(500).json({ message: err.message });
  }
};

//الحذف
exports.deleteMedicine = async (req, res, next) => {
  try {
    const med = await Medicine.findByIdAndDelete(req.params.id);

    if (!med)
      return next(createError(404, "Medicine not found الدواء غير موجود"));
    // return res.status(404).json({ message: "Medicine not found" });

    return returnJson(res, 200, true, "Deleted تم حذف الدواء", med);
    // res.json({ message: "Deleted" });
  } catch (err) {
    return next(createError(500, err.message));
    // res.status(500).json({ message: err.message });
  }
};

// ربط بديل لدواء
exports.addAlternative = async (req, res) => {
  const { id } = req.params;
  // console.log("req.body =", req.body);

  const { altId } = req.body;
  try {
    const med = await Medicine.findById(id);
    const alt = await Medicine.findById(altId);

    //مش موجود الدوا
    if (!med || !alt) {
      return next(
        createError(
          404,
          "Medicine or alternative not found الدواء أو البديل غير موجود"
        )
      );

      // return res
      //   .status(404)
      //   .json({ message: "Medicine or alternative not found" });
    }

    //منع ربط الدواء بنفسه
    if (id === altId) {
      return next(
        createError(
          400,
          "Cannot link medicine to itself لا يمكن ربط الدواء بنفسه"
        )
      );

      // return res
      //   .status(400)
      //   .json({ message: "Cannot link medicine to itself" });
    }

    if (!med.alternatives.includes(altId)) {
      med.alternatives.push(altId);
      await med.save();
    }
    return returnJson(
      res,
      200,
      true,
      "Alternative medicines added البديل انضاف",
      med
    );

    // res.json({ message: "Alternative medicines added البديل انضاف", med });
  } catch (err) {
    return next(createError(500, err.message));

    // res.status(500).json({ message: err.message });
  }
};

exports.updateAlternatives = async (req, res, next) => {
  try {
    const { altIds } = req.body; // array of medicine Object Ids

    const med = await Medicine.findByIdAndUpdate(
      req.params.id,
      { alternatives: altIds },
      { new: true }
    ).populate({
      path: "alternatives",
      select: "name price", //بس الاسم والسعر
      populate: {
        //كمان للدو  البديل جيب الصيدلية الي هو موجود فيها
        path: "pharmacy",
        select: "name address",
      },
    });
    // .populate('alternatives');

    if (!med)
      return next(createError(404, "Medicine not found الدواء غير موجود"));
    // return res.status(404).json({ message: "Medicine not found" });

    return returnJson(res, 200, true, "تم تحديث البدائل", med);
    // res.json(med);
    // test
  } catch (err) {
    return next(createError(500, err.message));
    // res.status(500).json({ message: err.message });
  }
};

exports.deleteAlternative = async (req, res, next) => {
  const { id, altId } = req.params;

  try {
    const med = await Medicine.findById(id);

    if (!med) {
      return next(createError(404, "Medicine not found الدواء غير موجود"));
      // return res.status(404).json({ message: "Medicine not found" });
    }

    // حذف البديل
    med.alternatives = med.alternatives.filter((alt) => alt != altId);
    await med.save();

    return returnJson(res, 200, true, "Alternative removed تم حذف البديل", med);
    // res.json({ message: "Alternative removed", med });
  } catch (err) {
    return next(createError(500, "Server error خطأ في الخادم"));

    // res.status(500).json({ message: "Server error" });
  }
};
