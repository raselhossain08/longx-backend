
const express =require('express')
const router =express.Router()
const {usdtPrice,CryptoClpPrice,CryptoRwaPrice,ChartPrice,cryptoPrice } =require('../controller/walletController')
const { protectRoute,authorizeRoles } = require('../middleware/auth')

router.route('/crypto/usdt',).get(usdtPrice)
router.route('/crypto/price',).get(cryptoPrice)
router.route('/crypto/clp',).get(CryptoClpPrice)
router.route('/crypto/rwa',).get(CryptoRwaPrice)
router.route('/crypto/prices',).get(ChartPrice)

module.exports = router

