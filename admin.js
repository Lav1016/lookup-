const mongoose = require('mongoose');
const validator = require('validator');
const expressValidator = require('express-validator')
const emailvalidator = require("email-validator");
const passwordValidator = require('password-validator')
const Joi = require('joi')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,        
    },
    phone: {
        type: Number,
        minlength: 10,
    },
    email: {
        type: String,
        required: 'Please enter your email',
        index: {
            unique: true,
        }
    },
    gender: {
        type: String
    },
    role: {
        type: String,
        default: 'staff',
        enum: ["nurse", "staff", "admin","doctor"]
    },
    otp: {
        type: Number,
    },
    accessToken: {
        type: String
    },
    status: {
        type: String
    }
},
    { timestamps: true }
);
adminSchema.path("email").validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, "Invalid e-mail address.");

// adminSchema.path("password").validate((val) => {
//     passwordRegex = /[0-9]{2}$/;
//     return  passwordRegex.test(val);
// }, "Invalid password pattern.");


module.exports = mongoose.model('Admin', adminSchema);