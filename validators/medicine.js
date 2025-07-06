const Joi = require("joi");
const mongoose = require("mongoose");

const objectIdVal = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid", { message: "Invalid ObjectId" });
  }

  return value;
}, "ObjectId Validation");

const createMedSch = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  price: Joi.number().min(0).required(),
  pharmacy: objectIdVal.required(),
  inStock: Joi.boolean().required(),
  description: Joi.string().trim().allow("").max(100),

  alternatives: Joi.array().items(objectIdVal).unique().optional(),
});

const updateMedSch = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  price: Joi.number().min(0).optional(),
pharmacy: objectIdVal.optional(),
  inStock: Joi.boolean().optional(),
  description: Joi.string().trim().allow("").max(100).optional(),
alternatives: Joi.array().items(objectIdVal).unique().optional(),
}).min(1) ;

module.exports = {
  validateCreateMed: (data) =>
    createMedSch.validate(data, { abortEarly: false }),
  validateUpdateMed: (data) =>
    updateMedSch.validate(data, { abortEarly: false }),
};
