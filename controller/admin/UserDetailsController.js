const crypto = require('crypto')
const ErrorHandler = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');

const User = require('../../models/User');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

// Controller to get all users
exports.getAllUsers = catchAsyncErrors(async(req, res) => {
        try {
          const users = await User.find();
          res.json(users);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
);

exports.updateUserBalance = catchAsyncErrors(async (req, res) => {
  try {
      const userId = req.params.id;
      const { balance } = req.body;

      // Find the user by ID and update the balance
      const user = await User.findByIdAndUpdate(userId, { balance }, { new: true });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Controller to delete a user by ID
exports.deleteUserById = catchAsyncErrors(async(req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.getUserProfileWallet = catchAsyncErrors(async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId).populate('wallet');
      res.json(user);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


exports.updateUserWallet = catchAsyncErrors(async (req, res) => {
    try {
        const userId = req.params.id;
        const { btc, usdt, clp, eth, trx, inj } = req.body;

        const updatedWalletData = { btc, usdt, clp, eth, trx, inj };

        // Find the user by ID and update the wallet data
        const user = await User.findByIdAndUpdate(userId, { wallet: updatedWalletData }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});