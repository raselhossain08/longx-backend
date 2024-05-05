
const express =require('express')
const router =express.Router()


const { registerAdminUser,adminLogin,adminProfile,adminForgotPassword ,adminResetPassword,adminUpdatePassword,adminLogout} = require('../../controller/admin/AdminAuthController')
const { protectRoute } = require('../../middleware/auth')

router.route('/auth/admin/register',).post(registerAdminUser)
router.route('/auth/admin/login').post(adminLogin)
router.route('/auth/admin/profile',).get(protectRoute,adminProfile)
router.route('/auth/admin/forget/password',).post(adminForgotPassword)
// Reset password
router.put('/admin/reset/password/:token', adminResetPassword);
router.route('/auth/admin/update/password',).post(protectRoute,adminUpdatePassword)
router.route('/logout',).get(adminLogout)
// Display reset password form



module.exports = router
