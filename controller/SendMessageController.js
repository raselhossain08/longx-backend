const crypto = require('crypto')
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken =require('../utils/jwtToken');

const sendMessage =catchAsyncErrors(async(req,res,next) => {
    try {
        const { name, email, subject, message } = req.body;

        // You can perform validation here if needed

        // Call the sendEmail function passing the email details
        await sendEmail({ email, subject, message });

        // Respond to the client
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

module.exports = sendMessage;
