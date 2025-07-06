const Joi = require('joi');

const schemas = {
  register: Joi.object({
    name:     Joi.string().min(2).max(20).trim().required(),
    email:    Joi.string().email().trim().required(),
    password: Joi.string().min(6).max(100).required(),
  }),
  login: Joi.object({
    email:    Joi.string().email().trim().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  validateRegister: data =>
     schemas.register.validate(data, { abortEarly: false }),
  
  validateLogin:    data => 
    schemas.login.validate(data,    { abortEarly: false }),
};
