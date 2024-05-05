

const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/User');

// Controller function to get wallets
exports.getWallets = catchAsyncErrors(async (req, res, next) => {
    console.log(req.user._id)
    const userId = req.user._id; // Assuming userId is attached to the request object by middleware
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ wallets: user.wallet });
});

// Controller function to transfer balance from one wallet to another
exports.transferBalance = catchAsyncErrors(async (req, res, next) => {
    const { fromCurrency, toCurrency } = req.body;
    const userId = req.user._id; // Assuming userId is attached to the request object by middleware
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Transfer balance logic here
    const amountToTransfer = user.wallet[fromCurrency];
    if (amountToTransfer === undefined) {
        return res.status(400).json({ message: 'Invalid currency' });
    }
    
    user.wallet[fromCurrency] = 0;
    user.wallet[toCurrency] += amountToTransfer;
    await user.save();

    res.status(200).json({ message: 'Balance transfer successful' });
});
