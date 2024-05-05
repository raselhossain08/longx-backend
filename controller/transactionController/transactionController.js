const DepositRequest = require('../../models/transactionModel/DepositRequest');
const WithdrawalRequest = require('../../models/transactionModel/withdrawalRequest');


// Create a new withdrawal request
exports.createWithdrawalRequest = async (req, res) => {
    try {
        const { user, amount, currency } = req.body;
        const withdrawalRequest = await WithdrawalRequest.create({ user, amount, currency });
        res.status(201).json({ success: true, data: withdrawalRequest });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Create a new deposit request
exports.createDepositRequest = async (req, res) => {
    try {
        const { user, amount, currency } = req.body;
        const depositRequest = await DepositRequest.create({ user, amount, currency });
        res.status(201).json({ success: true, data: depositRequest });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all withdrawal requests
exports.getAllWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await WithdrawalRequest.find();
        res.status(200).json({ success: true, data: withdrawalRequests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all deposit requests
exports.getAllDepositRequests = async (req, res) => {
    try {
        const depositRequests = await DepositRequest.find();
        res.status(200).json({ success: true, data: depositRequests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update the status of a withdrawal request
exports.updateWithdrawalRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const withdrawalRequest = await WithdrawalRequest.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: withdrawalRequest });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update the status of a deposit request
exports.updateDepositRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const depositRequest = await DepositRequest.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: depositRequest });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
