
const express =require('express')
const router =express.Router()
const {TotalUser,NewUsers } =require('../controller/profileController')
const { protectRoute,authorizeRoles } = require('../middleware/auth')

router.route('/total/users',).get(TotalUser)
router.route('/new/users',).get(NewUsers)

module.exports = router
