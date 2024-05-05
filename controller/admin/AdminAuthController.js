const crypto = require('crypto')
const ErrorHandler = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const sendToken = require('../../utils/jwtToken');
const AdminUser = require('../../models/admin/AdminUser');

// register  api
exports.registerAdminUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, phone, role } = req.body
    const user = await AdminUser.create({
        name,
        email,
        password,
        phone,
    })
    sendToken(user, 200, res)
    console.log(token)
});
// Login User => login

exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    // check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler("please enter your & password", 400));
    }
    // Finding user in database
    const user = await AdminUser.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    sendToken(user, 200, res)
});
// profile
exports.adminProfile = catchAsyncErrors(async (req, res, next) => {
    res.json(req.user);
})

// forgot password 

exports.adminForgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    try {
        // 1. Find the user by email
        const user = await AdminUser.findOne({ email });

        if (!user) {
            return next(new ErrorHandler('User not found with this email', 404));
        }

        // 2. Generate reset token
        const resetToken = user.generateResetPasswordToken();

        // 3. Save user with reset token and expiry date
        await user.save({ validateBeforeSave: false });

        // 4. Create reset password URL
        const resetUrl = `${process.env.RESET_PASS}/admin/password/reset/${resetToken}`;

        // 5. Compose email message
        const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;

        // 6. Send email
        await sendEmail({
            email: user.email,
            subject: 'Longx Password Recovery',
            message
        });

        res.status(200).send({
            success: true,
            message: `Email sent to ${user.email}`
        });
    } catch (err) {
        console.error('Error sending password reset email:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('Email could not be sent', 500));
    }
});


// Reset password
exports.adminResetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = req.params.token;

    try {
        // Hash the token to compare with the stored resetPasswordToken in the database
        const hashedToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

        // Find the user by the hashed token and ensure the token hasn't expired
        const user = await AdminUser.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        // If no user is found or the token has expired, return an error
        if (!user) {
            return next(new ErrorHandler('Invalid or expired reset token', 400));
        }

        // Check if the new password and confirm password match
        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler('Passwords do not match', 400));
        }

        // Set the new password and clear the reset token fields
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Save the updated user to the database
        await user.save();

        // Send the response with a new token
        sendToken(user, 200, res);
    } catch (error) {
        console.error('Error resetting password:', error);
        return next(new ErrorHandler('Error resetting password', 500));
    }
});


// logout user 

exports.adminLogout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "logged out"
    })
});
// get user information
exports.adminGetUser = catchAsyncErrors(async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by ID
        const user = await AdminUser.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// update user
// Update user details by ID
exports.adminUserInfoUpdate = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const updateFields = req.body;

        // Find the user by ID and update their details
        const user = await AdminUser.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User details updated successfully', user });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.adminUpdatePassword = catchAsyncErrors(async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find the user by ID
        const user = await AdminUser.findById(req.user._id).select('+password');

        // Check if the current password matches
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Set the new password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        // Check for specific errors
        if (error.name === 'MongoError' && error.code === 11000) {
            // Duplicate key error (e.g., if the new password violates a unique constraint)
            return res.status(400).json({ error: 'Duplicate key error' });
        } else if (error.name === 'ValidationError') {
            // Validation error (e.g., if the new password doesn't meet validation rules)
            return res.status(400).json({ error: error.message });
        } else {
            // Other server errors
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
})