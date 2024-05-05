const express = require('express');
const router = express.Router();

const { protectRoute } = require('../../middleware/auth');
const { createWithdrawalRequest, getAllWithdrawalRequests, updateWithdrawalRequestStatus, createDepositRequest, getAllDepositRequests, updateDepositRequestStatus } = require('../../controller/transactionController/transactionController');
// Withdrawal requests routes
router.post('/withdrawals', createWithdrawalRequest, protectRoute);
router.get('/withdrawals', getAllWithdrawalRequests,protectRoute);
router.put('/withdrawals/:id',updateWithdrawalRequestStatus,protectRoute);

// Deposit requests routes
router.post('/deposits', createDepositRequest,protectRoute);
router.get('/deposits',getAllDepositRequests,protectRoute);
router.put('/deposits/:id', updateDepositRequestStatus,protectRoute);

module.exports = router;
