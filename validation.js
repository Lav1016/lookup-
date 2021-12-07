
const { params, body, validationResult } = require('express-validator');
const model = require('../model/admin').address;

const userValidationRules = () => {
    return [
        body('password')
            .notEmpty().withMessage('Please Enter the Password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('\[0-9\]').withMessage('Password must be contain at least 1 number.')
        .matches('\[a-z\]').withMessage('Password must be contain at least 1 lowercase letter.')
        .matches('\[A-Z\]').withMessage('Password must be contain at least 2 uppercase letter.')
    ]
}

const loginValidationRules = () => {
    return [
        body('username')
            .notEmpty().withMessage('Please Enter the Username')
            .isEmail().withMessage('Please Enter the Valid Username'),
        body('password')
            // sLength({ min: 10 }).withMessage('must be at least 10 chars long').
            .notEmpty().withMessage('Please Enter the Password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters in length.')
    ]
}

const patientValidationRules = () => {
    return [
        body('firstname')
            .notEmpty().withMessage('Please Enter the First Name')
            .isLength({ min: 3 }).withMessage('must be at least 10 chars long'),
        body('lastname')
            .isLength({ min: 3 }).withMessage('must be at least 10 chars long')
            .notEmpty().withMessage('Please Enter the last name'),
        body('homephone')
            .isNumeric().withMessage('Please enter the number Phone')
            .notEmpty().withMessage('Please Enter the Phone')
            .isLength({ min: 10 }).withMessage('must be at least 10 chars long'),
        body('mobile')
            .isNumeric().withMessage('Please enter the number mobile')
            .notEmpty().withMessage('Please Enter the mobile')
            .isLength({ min: 10 }).withMessage('must be at least 10 chars long'),
        body('age')
            .notEmpty().withMessage('Please Enter the age')
            .isNumeric().withMessage('Please enter the number age')
            .isLength({ min: 2 }).withMessage('must be at least 10 chars long'),
        body('bloodgroup')
            .notEmpty().withMessage('Please Enter the blood group'),
        body('dob')
            .notEmpty().withMessage('Please Enter the date of birth'),
        // body('recordstatusid')
        //     .isNumeric().withMessage('Please enter the number recordstatusid')
        //     .notEmpty().withMessage('Please Enter the RecordStatus'),
        // body(model.address)
        //     .notEmpty().withMessage('Please Enter the address')
        //     .isNumeric().withMessage('Please enter the number address'),
        // body('city')
        //     .notEmpty().withMessage('Please Enter the city'),
        // body('state')
        //     .notEmpty().withMessage('Please Enter the state'),
        // body('country')
        //     .notEmpty().withMessage('Please Enter the country'),
        // body('zipcode')
        //     .notEmpty().withMessage('Please Enter the zipcode')
        //     .isNumeric().withMessage('Please enter the number zipcode'),
        // body('patient_staff_id')
        //     .notEmpty().withMessage('Please Enter the patient name'),
        // body('username')
        //     .notEmpty().withMessage('Please Enter the Username')
        //     .isEmail().withMessage('Please Enter the Valid Username'),
        // body('password')
        //     // sLength({ min: 10 }).withMessage('must be at least 10 chars long').
        //     .notEmpty().withMessage('Please Enter the Password')
        //     .isLength({ min: 8 }).withMessage('Password must be at least 8 characters in length.')
        //     .matches('\[0-9\]').withMessage('Password must contain at least 1 number.')
        //     .matches('\[a-z\]').withMessage('Password must contain at least 1 lowercase letter.')
        //     .matches('\[A-Z\]').withMessage('Password must contain at least 1 uppercase letter.'),
        // body('roleid')
        //     .isNumeric().withMessage('Please enter the number Role')
        //     .notEmpty().withMessage('Please Enter the Role'),
        // body('recordstatusid')
        //     .isNumeric().withMessage('Please enter the number recordstatusid')
        //     .notEmpty().withMessage('Please Enter the RecordStatus'),
        // body('practiceid')
        //     .notEmpty().withMessage('Please Enter the Practice')
        //     .isNumeric().withMessage('Please enter the number Practice'),
    ]
}

const staffValidationRules = () => {
    return [
        body('firstname')
            .notEmpty().withMessage('Please Enter the First Name')
            .isLength({ min: 3 }).withMessage('must be at least 10 chars long'),
        body('lastname')
            .isLength({ min: 3 }).withMessage('must be at least 10 chars long')
            .notEmpty().withMessage('Please Enter the last name'),
    ]
}

const apimedic = () => {
    console.log('sss', params);
    return [
        body('bodyId')
            .notEmpty().withMessage('Please Enter the First Name'),
        body('gender')
            .notEmpty().withMessage('Please Enter the last name'),
    ]
}
const verifyPasswordLinkvalidate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        console.log('errors');
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
    console.log('er', extractedErrors);
    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    // validate,
    // patientValidationRules,
    // loginValidationRules,
    // staffValidationRules,
    // apimedic
}

