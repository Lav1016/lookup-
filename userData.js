const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
let moment = require("moment");


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const mongoose = require("mongoose");
const userData = require('../model/UserData')
const Role = require('../model/docter-role')

const userAddress = require('../model/userAddress')
var resourcehelper = require('../helper/recoursehelper');
const { sendMail, emailValidation, sendMailCustomer } = require("../utils/mail");
require('../app')

exports.signup = async (req, res, next) => {
    let ipAddress = req.connection.remoteAddress;
    try {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(200).json({
                    status: "data not found ",
                    error: err
                })
            }
            else {
                const newuserData = userData({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email: req.body.email,
                    roleID: req.body.roleID,
                    gender: req.body.gender,
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword
                });
                userData.findOne({ email: req.body.email }, (err, result) => {
                    if (err) {
                        res.status(501).json({
                            msg: 'err'
                        })
                    }
                    if (Boolean(result)) {
                        res.status(201).json({
                            msg: 'email already exist'
                        })
                    } else {
                        newuserData.save()
                            .then(result => {
                                console.log(result)
                                const newAddress = userAddress({
                                    address: req.body.address.address1 + req.body.address.address2,
                                    city: req.body.address.city,
                                    state: req.body.address.state,
                                    zip: req.body.address.zip,
                                    phone: req.body.address.phone,
                                    country: req.body.address.country,
                                    user_id: result._id,

                                })
                                newAddress.save()
                                    .then(result1 => {
                                        res.status(200).json({
                                            new_user: result,
                                            address: result1,
                                            msg: "user successfully registered"
                                        })

                                    })
                                    .catch(error => {
                                        console.log('error', error)
                                        res.status(501).json({
                                            error: 'err '
                                        })
                                    })
                            })
                            .catch(error => {
                                console.log('error', error)
                                res.status(501).json({
                                    error: 'err '
                                })
                            })
                    }
                })
            }
        });
    } catch {
        res.json({
            status: "201"
        })
    }
}

module.exports.login = async (req, res, next) => {
    // console.log(req.body);
    let ipAddress = req.connection.remoteAddress;
    // try {
    const user1 = await userData.findOne({ email: req.body.email });
    // console.log("helllo",user1)
    if (user1) {
        let users = new userData();
        // const passwordmatch= await bcrypt.compare(req.body.password, user.password);
        const passwordmatch = user1.verifyPassword(req.body.password);
        // console.log("hyyyyyyyyyyyyy1",passwordmatch)
        if (passwordmatch) {
            let objdetails = {
                emailId: req.body.email,
                userID: user1._id
            };
            // console.log("sww2222222",objdetails)

            const tokenValue = users.generateJwt(objdetails);
            console.log("g22222", tokenValue)
            user1.isActiveUser = true


            user1.save()

            res.status(200).json({
                msg: 'login successfully',
                status: true,
                loginUser: user1,
                token: tokenValue
            })

        } else {
            res.status(201).json({
                status: false,
                msg: 'record not found'
            })
        }
    } else {
        res.status(201).json({
            status: false,
            msg: 'record not found'
        })
    }
    // } catch (ex) {
    //     res.status(400).json({
    //         responseCode: resourcehelper.exception_msg_code,
    //         error: resourcehelper.exception_msg_text,
    //         err: ex,
    //         status: false,
    //     });
    // // }
};

module.exports.forgotPassword = async (req, res, next) => {
    try {
        email = req.body.email;

        if (email.length == 0) {
            console.error("email-0", req.body.email)
            res.status(400).json({ message: 'Email is required' })
        }
        if (email.length) {
            console.error("email", req.body.email)
            userData.find({ email: email })
                .then(result => {
                    console.log(result[0].email)
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    console.log("otp", otp)
                    //const user = new admin()
                    userData.updateOne({ email: req.body.email },
                        { $set: { otp: otp } }, { upsert: true }, function (err) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("otp update")
                            }
                        });
                    res.status(200).json({
                        "status": "success",
                        "msg": "otp send successfully"
                    });
                })
            // mail start

        }
        else {
            res.status(501).json({
                msg: 'Data not matched enter the correct details '
            })
        }
    } catch {
        res.json({
            status: "201",
            msg: "something went wrong"
        })
    }
}

exports.verifyotp = async (req, res, next) => {
    try {
        let email = req.body.email
        let userOtp = req.body.otp
        userData.find({ email: email })
            .then(result => {
                console.log('result', result)
                let dbOtp = result[0].otp
                console.log('dbOtp', dbOtp)
                console.log('userOtp', userOtp)
                if (userOtp == dbOtp) {
                    console.log("111111")
                    userData.findOneAndUpdate({ email: email }, {
                        $set: {
                            status: true
                        }
                    })
                        .then(result => {
                            console.log("test code")
                            res.json({
                                status: "success",
                                msg: "otp has been send",
                                data: result
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                }
                else {
                    res.status(400).json({
                        responseCode: resourcehelper.exception_msg_code,
                        error: resourcehelper.exception_msg_text,
                        // err: ex,
                        status: false,
                    });
                }
            })
    } catch {
        res.json({
            status: "201",
            msg: "something went wrong"
        });
    }
}

exports.passwordUpdate = async (req, res, next) => {
    try {
        console.log(req.body.email)
        let newPassword = req.body.newPassword
        console.log('h1', newPassword)
        bcrypt.hash(newPassword, 10, (err, result) => {
            if (err) {
                res.send('err', err)
            }
            else {
                console.log('hello')
                userData.findOneAndUpdate({ email: req.body.email, }, {
                    $set: {
                        password: result
                    }
                })
                    .then(result => {
                        res.status(200).json({
                            "msg": "your password is successfully update"
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
            }
        })
    } catch {
        res.status(400).json({
            responseCode: resourcehelper.exception_msg_code,
            error: resourcehelper.exception_msg_text,
            // err: ex,
            status: false,
        });

    }


}

exports.deleteUser = async (req, res, next) => {
    try {
        console.log(req.params.id);
        userData.findByIdAndDelete({ _id: req.params.id })
            .then(result => {
                res.json({
                    status: "success",
                    massage: "user data has been deleted",
                    data: result
                })
            })
            .catch(err => {
                res.status(400).json({
                    responseCode: resourcehelper.exception_msg_code,
                    error: resourcehelper.exception_msg_text,
                    // err: ex,
                    status: false,
                });
            })
    } catch {
        res.json({
            status: "201",
            massage: "something went wrong"
        })
    }
}

//get all user...................
exports.userData = async (req, res, next) => {
    try {
        // { $match : { "roleID" :req.params.id} },
        console.log(req.params.id)

        userData.aggregate([
            {
                $lookup: {
                    from: "useraddresses",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "useraddresses"
                }
            },
            // {
            //     $unwind: "$useraddresses"
            // },
            {
                $project: {
                    __v: 0,
                    // "address.__v": 0,
                    "address._id": 0,
                    "address.city": 0,
                    "address.state": 0,
                    "address.zip":0,
                    "address.phone":0,
                    "address.country":0,



                }
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "roleID",
                    foreignField: "roleId",
                    as: "roles"
                }
            },
           
            // {
            //     $unwind: "$roles"
            // }
        ]).exec((err, result) => {
            if (err) {
                // console.log("n working")
                res.status(resourcehelper.unprocessable_code).json({
                    responseCode: resourcehelper.unprocessable_code,
                    result: err,
                });
            }
            if (result) {
                console.log(result)
                res.status(resourcehelper.msg_update_code).json({
                    responseCode: resourcehelper.msg_update_code,
                    result: result,
                });

            }
        });
    } catch (erro) {
        res.status(resourcehelper.exception_msg_code).json({
            responseCode: resourcehelper.exception_msg_code,
            result: erro,
        });
    }
}
//get one UserDetails
exports.userDetails = async (req, res, next) => {

    try {

        userData.aggregate([{ $match: { "roleID": req.body.roleID } },

        // Join with userDatatable
        {
            $lookup: {
                from: "useraddresses",
                localField: "_id",
                foreignField: "user_id",
                as: "useraddresses"
            }
        },
        // {
        //     $project:{
        //         "_id":1,
        //         "userId" : 1,
        //         "phone" : 1,
        //         "role" :"role"
        //     }
        // },
        {
            $unwind: "$useraddresses"
        },
        {
            $lookup: {
                from: "roles",
                localField: "roleID",
                foreignField: "roleId",
                as: "roles"
            }
        },

        // define some conditions here 
        // {
        //     $match:{
        //         $and:[{"Role" : "admin"}]
        //     }
        // },
        // define which fields are you want to fetch
        // {   
        //     $project:{
        //         _id : 1,
        //         email : 1,
        //         userName : 1,
        //         phone : 1,
        //         role : "$roles",
        //     } 
        // } 
        {
            $unwind: "$roles"
        }
        ]).exec((err, result) => {
            if (err) {
                // console.log("n working")
                res.status(resourcehelper.unprocessable_code).json({
                    responseCode: resourcehelper.unprocessable_code,
                    result: err,
                });
            }
            if (result) {
                // console.log(result)
                res.status(resourcehelper.msg_update_code).json({
                    responseCode: resourcehelper.msg_update_code,
                    result: result,
                });

            }
        });
    } catch (erro) {
        res.status(resourcehelper.exception_msg_code).json({
            responseCode: resourcehelper.exception_msg_code,
            result: erro,
        });
    }
}

module.exports.updateUserdetailes = async (req, res, next) => {
    try {
        const updateuser = {
            username: req.body.username,
            gender: req.body.gender,
            dateUpdated: moment()
        };
        const updateAdress = {
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            phone: req.body.phone,
        }
        const personinfo_update = await userData.findOneAndUpdate({ _id: req.body._id }, { $set: updateuser });
        // console.log(personinfo_update);
        const adress_update = await userAddress.findOneAndUpdate({ user_id: personinfo_update._id }, { $set: updateAdress });
        // console.log('hjgj',personinfo_update.roleID)
        const role_user = await Role.findOne({roleId:personinfo_update.roleID});
        // console.log('hjgj',role_user)
        res.json({
            status: "success",
            msg: "data successfully updated",
            result: [{ user: personinfo_update, address: adress_update,role:role_user}]

        })

    } catch (er) {
        res.status(resourcehelper.exception_msg_code).json({
            responseCode: resourcehelper.exception_msg_code,
            result: er,
        });
    }
}
//find listing  active or deleted user
exports.deleteUserDetails = async (req, res, next) => {
    try {
        // console.log('hellooo');
        const id = req.params.id;
        await userData.findOneAndUpdate({ _id: id }, { $set: { isDeleteUser: true } }, async function (e, result) {
            console.log(id);
            if (e) {
                res.status(resourcehelper.unprocessable_code).json({
                    responseCode: resourcehelper.unprocessable_code,
                    result: e,
                });
            }
            if (result) {
                res.json({
                    msg: "data updated",
                    data: result
                })
                // { $or: [ { Expression1 }, { Expression2 }, ..., { ExpressionN } ] }

                let user = await userData.find({$or:[{ 'isActiveUser': true, isDeleteUser: false }]})
                res.json({
                    msg: "success data",
                    data: user
                })
                //    res.send('ok')
            }

        });
        // listing 
        // let user= await userData.find({'isActiveUser':true,isDeleteUser:false})
        // res.json({
        //     msg:"success data",
        //     data:user
        // })
    } catch (errr) {
        console.log('throw')


    }
}






exports.deleteUser = async (req, res, next) => {
    try {
        console.log(req.params.id);
        userData.findByIdAndDelete({ _id: req.params.id })
            .then(result => {
                res.json({
                    status: "success",
                    massage: "user data has been deleted",
                    data: result
                })
            })
            .catch(err => {
                res.status(400).json({
                    responseCode: resourcehelper.exception_msg_code,
                    error: resourcehelper.exception_msg_text,
                    // err: ex,
                    status: false,
                });
            })
    } catch {
        res.json({
            status: "201",
            massage: "something went wrong"
        })
    }
}


async function save_address(data, user_id) {

}