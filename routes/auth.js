
const express =require('express')
const router =express.Router()
const { registerUser,login,forgotPassword,logout,userInfoUpdate,getUser,profile,updatePassword,resetPassword } =require('../controller/authController')
const { protectRoute,authorizeRoles } = require('../middleware/auth')

router.route('/auth/register',).post(registerUser)
router.route('/user/profile',).get(protectRoute,profile)
router.route('/auth/login',).post(login)
router.route('/auth/forget/password',).post(forgotPassword)
// Reset password
router.put('/reset/password/:token', resetPassword);
router.route('/auth/update/password',).post(protectRoute,updatePassword)
router.route('/logout',).get(logout)
// Display reset password form



module.exports = router
