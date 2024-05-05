
const express = require('express');
const router = express.Router();


const { getWallets , transferBalance } = require('../controller/ExchangeController');
const { protectRoute } = require('../middleware/auth');

// Route to get wallets
router.get('/wallets', protectRoute, getWallets);

// Route to transfer balance
router.post('/transfer', protectRoute, transferBalance);

module.exports = router;
