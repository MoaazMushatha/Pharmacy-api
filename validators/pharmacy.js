const Joi = require("joi");

const createPharmacySch = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  address: Joi.string().trim().min(5).max(50).required(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9\-\+]{7,15}$/)
    .optional(),
});

const updatePharmacySch = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  address: Joi.string().trim().min(5).max(50).optional(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9\-\+]{7,15}$/)
    .optional(),
})
  .min(1)
  .messages({
    "object.min": "يرجى إرسال حقل واحد على الأقل للتحديث.",
  });

module.exports = {
  validCreatePhar: (data) =>
    createPharmacySch.validate(data, { abortEarly: false }),

  validUpdatePhar: (data) =>
    updatePharmacySch.validate(data, { abortEarly: false }),
};
