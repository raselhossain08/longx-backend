
const User = require('../models/User');
const ErrorHandler =require('../utils/errorHandler')
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');

// check if user is authenticated or not
exports.protectRoute = catchAsyncErrors( async (req,res,next)=>{
    // for angular
    let token  =req.headers.authorization
    if (token.startsWith("Bearer ")) {
        // Remove the "Bearer " prefix
        token = token.slice(7);
    }
    // // postman
    // const {token} = req.cookies
    if(!token) {
        return next(new ErrorHandler('login first to access this resource',401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET )
    req.user = await User.findById(decoded.id)
    next()
})

// handling user roles

exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403)
            )
           
        }
        next()
    }
}