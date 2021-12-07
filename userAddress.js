var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const userAddressSchema = new Schema({
    user_id:{
        type: Object,
        required: true,

    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },
    phone: {
        type: String,
        required: true,

    },
    country: {
        type: String,

    },
    

    isActiveUser: {
        type: Boolean,
        default: false,
    },
    ipAddress: {
        type: String,
    },
},
{ timestamps: true }
);
// Custom validation for email
// userAddressSchema.path("email").validate((val) => {
//     emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, "Invalid e-mail address.");



const userAddress = mongoose.model("userAddress", userAddressSchema);
module.exports = userAddress;
