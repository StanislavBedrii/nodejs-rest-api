const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
const { Subscription } = require('../../helpers/constants');

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate(value) {
                const isValid = /\S+@\S+\.\S+/
                return isValid.test(String(value).toLowerCase())
            },
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: {
                values: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
                message: 'It isn\'t allowed',
            },
            default: Subscription.FREE
        },
        password: {
            type: String,
            default: 'password',
        },
        token: {
            type: String,
            default: '',
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: 'user'
        },
    },
    { timestamps: true }
);

contactSchema.plugin(mongoosePaginate);
const Contact = model('contact', contactSchema);

module.exports = Contact;