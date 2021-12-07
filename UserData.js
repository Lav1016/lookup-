const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require('path');
//const { validationResult } = require("express-validator");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const expressValidator = require('express-validator')

const userSchema = new Schema({
  role_id:{
    type:String
  },
  username: {
    type: String,
    trim: true,
    default: null
},
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  
  gender: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  isActiveUser: {
    type: Boolean,
    default: false,
  },
  isDeleteUser:{
    type:Boolean,
    default:false
  },
  token: {
    type: String,
    default: ""
  },
  otp: {
    type: Number,
},
  ipAddress: {
    type: String,
  },
  status: {
    type: String
  },
  roleID:{
    type:Number
  }
},
  { timestamps: true }
);
// Custom validation for email
userSchema.path("email").validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail address.");

userSchema.pre("save", function (next) {
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
  this.saltSecret = salt;
  next();
});

//Verify Password

userSchema.methods.verifyPassword = function (password) {
  //console.log(password,this.password);
  return bcrypt.compareSync(password, this.password);
};

// Generate JWT token
userSchema.methods.generateJwt = (data) => {
  //console.log('jwt valueee',process.env.JWT_EXP)

  const  token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
   console.log('jwt token',token)
  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
