const mongoose = require('mongoose');
const validator = require('validator');
const expressValidator = require('express-validator')
// const emailvalidator = require("email-validator");
// const passwordValidator = require('password-validator')


const  Role = new mongoose.Schema({
    id: {
        type: String,
    },
    Role: {
        type: String
    },
    roleId: {
        type: Number
    }


})
    

module.exports = mongoose.model('role', Role);
