const Joi = require("joi");
module.exports = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    'x-user-token': Joi.string()
        .alphanum()
        .required(),
});