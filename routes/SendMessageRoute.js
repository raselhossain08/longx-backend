
const express =require('express')
const sendMessage = require('../controller/SendMessageController')
const router =express.Router()


router.route('/send/message',).post(sendMessage)

module.exports = router
