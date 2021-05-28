const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaRegister = Joi.object({
    name: Joi.string().min(2).max(20),
    subscription: Joi.any().valid("free", "pro", "premium"),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    password: Joi.string().required(),
});

const schemaLogin = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    subscription: Joi.string().optional(),
    password: Joi.string().required(),
    token: Joi.any().optional(),
});

const schemaUpdateSub = Joi.object({
    subscription: Joi.string().valid("free", "premium", "pro").optional(),
}).min(1);

const validate = (schema, obj, next) => {
    const { error } = schema.validate(obj);
    if (error) {
        const [{ message }] = error.details;
        return next({
            status: HttpCode.BAD_REQUEST,
            message: `Filed: ${message.replace(/"/g, "")}`,
        });
    }
    next();
};

module.exports.register = (req, res, next) => {
    return validate(schemaRegister, req.body, next);
};

module.exports.login = (req, res, next) => {
    return validate(schemaLogin, req.body, next);
};

module.exports.updateSub = (req, res, next) => {
    return validate(schemaUpdateSub, req.body, next);
};

module.exports.uploadAvatar = (req, res, next) => {
    if (!req.file) {
        return res.status(HttpCode.BAD_REQUEST).json({
            status: 'error',
            code: HttpCode.BAD_REQUEST,
            data: 'Bad request',
            message: 'Field of avatar with file not found',
        })
    }
    next()
};