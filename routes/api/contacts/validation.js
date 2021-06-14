const Joi = require("joi");

const schemaCreateContact = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .required(),
    subscription: Joi.string().optional(),
    password: Joi.string().optional(),
    token: Joi.string().optional(),
});

const schemaUpdateContact = Joi.object({
    name: Joi.string().min(3).max(20).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string()
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .optional(),
    subscription: Joi.string().optional(),
    password: Joi.string().optional(),
    token: Joi.string().optional(),
}).min(1);

const validate = (schema, obj, next) => {
    const { error } = schema.validate(obj);
    if (error) {
        const [{ message }] = error.details;
        return next({
            status: 400,
            message: `Filed: ${message.replace(/"/g, "")}`,
        });
    }
    next();
};

module.exports.createContact = (req, _res, next) => {
    return validate(schemaCreateContact, req.body, next);
};

module.exports.updateContact = (req, _res, next) => {
    return validate(schemaUpdateContact, req.body, next);
};