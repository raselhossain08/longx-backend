const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


exports.TotalUser =catchAsyncErrors(async(req,res,next)=>{
    try {
      const usersCount = await User.countDocuments();
      res.json({ usersCount });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
})
exports.NewUsers =catchAsyncErrors(async(req,res,next)=>{
  try {
    // Get length of all users
    const usersCount = await User.countDocuments();

    // Get new users (assume new users are those created in the last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
    const newUsers = await User.find({ createdAt: { $gte: twentyFourHoursAgo } });

    res.json({ usersCount, newUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
