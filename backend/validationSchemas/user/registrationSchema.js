const Joi = require('joi');

module.exports = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(2)
        .max(20)
        .required(),
    password: Joi.string()
        .alphanum()
        .min(3)
        .required(),
    email: Joi.string()
        .min(6)
        .required(),
});