const { body, param } = require("express-validator");
const signUpValidator = [
    body("email").isEmail().withMessage('in-valid email syntax'),
    body("password").isStrongPassword().withMessage('in-valid password'),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    body("gender").isString().matches('^(female|male)$').withMessage('invalid gender')
]
const signInValidator = [
    body("email").isEmail().withMessage('in-valid email syntax'),
    body("password").isStrongPassword().withMessage('in-valid password')
]
const tokenValidator = [
    param("token").isJWT().withMessage('invalid token')
]
const idValidator = [
    param("id").isString().isLength({ min: 24, max: 24 }).withMessage("id invalid")
]
const completeProfileValidator = [
    body("firstName").isString().withMessage('in-valid first name validation'),
    body("lastName").isString().withMessage('in-valid last name validation'),
    body("phone").isNumeric().isLength({ options: { min: 11, max: 11 } }).withMessage('in-valid phone validation'),
    body("faculty").isString().withMessage('in-valid faculty validation'),
]
const forgetPasswordValidator = [
    body("email").isEmail().withMessage('in-valid email syntax')
]
const resetPasswordValidator = [
    body("newPassword").isStrongPassword().withMessage('in-valid password'),
    body("cNewPassword").custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    param("token").isJWT().withMessage('invalid token')
]
const changePassValidator = [
    body("oldPassword").isStrongPassword().withMessage('in-valid old password'),
    body("newPassword").isStrongPassword().withMessage('in-valid password'),
    body("cNewPassword").custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
]
module.exports = {
    signUpValidator,
    signInValidator,
    tokenValidator,
    idValidator,
    completeProfileValidator,
    forgetPasswordValidator,
    resetPasswordValidator,
    changePassValidator
}