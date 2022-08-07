const router = require('express').Router();
const { signUp, confirmEmail, resendEmail, signIn } = require('./controller/register');
const handleValidation = require('../../common/middleware/validation');
const { signUpValidator, signInValidator, tokenValidator, idValidator, completeProfileValidator, forgetPasswordValidator, resetPasswordValidator, changePassValidator } = require('./user.validator');
const { viewProfile, viewUserProfile, completeProfile } = require('./controller/profile');
const endPoint = require('./endPoint');
const auth = require('../../common/middleware/auth');
const { forgotPassword, resetPassword, changePassword } = require('./controller/password');

/***********REGISTER************/
//signUp
router.post('/user/signup', signUpValidator, handleValidation(), signUp)
//send email
router.get('/user/confirm/:token', tokenValidator, handleValidation(), confirmEmail)
router.get('/user/resend/:token', tokenValidator, handleValidation(), resendEmail)
//signin
router.post('/user/signin', signInValidator, handleValidation(), signIn)

/*************PROFILE**************/
//view your profile
router.get('/user/profile', auth(endPoint.viewProfile), viewProfile)
//view another user's profile
router.get('/user/profile/:id', idValidator, handleValidation(), viewUserProfile)
//complete your profile
router.post('/user/profile/complete', auth(endPoint.completeProfile), completeProfileValidator, handleValidation(), completeProfile)


module.exports = router




// /**********HANDLE PASSWORD**********/
// //forget password
// router.post('/user/forget/password', forgetPasswordValidator, handleValidation(), forgotPassword)
// //reset password
// router.patch('/user/resetPassword/:token', resetPasswordValidator, handleValidation(), resetPassword)
// //change password
// router.patch('/user/update/password', auth(endPoint.changePass), changePassValidator, handleValidation(), changePassword)