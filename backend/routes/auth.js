const {login,register, verifyTheOtp, resendOtp, verifyTheOtpForNewPassword, updatePassword} = require('../controllers/authController')
const router = require('express').Router()

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/verify").post(verifyTheOtp)
router.route("/verify/new-password").post(verifyTheOtpForNewPassword)
router.route("/update-password").post(updatePassword)
router.route("/resend").post(resendOtp)

module.exports = router
