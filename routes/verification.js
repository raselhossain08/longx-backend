
const express = require('express')
const router = express.Router()
const { profileDetails, getProfileDetails } = require('../controller/Verification/personalDetailsController')
const { protectRoute } = require('../middleware/auth')

router.route('/user/information',).post(protectRoute, profileDetails)
router.route('/user/information',).get(protectRoute, getProfileDetails)
module.exports = router
