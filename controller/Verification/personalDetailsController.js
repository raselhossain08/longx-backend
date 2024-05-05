const Verification = require('../../models/UserVerification');
const ErrorHandler = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

exports.profileDetails = catchAsyncErrors(async (req, res, next) => {
    const { id, home, city, country, regionState, nationality, bankName, bankAccountNumber, accountName, rut, addRut } = req.body;
    const user = await Verification.create({
        id,
        home, city, country, regionState, nationality, bankName, bankAccountNumber, accountName, rut, addRut
    });
    res.json({
        message: 'success',
        user
    });
});
exports.getProfileDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.user._id;
        let id;
        const document = await Verification.find({ id: `${userId}` });
        if (!document) {
            return res.status(404).json({ message: 'User verification document not found' });
        }
        res.status(200).json({ message: 'Success', document });
    } catch (error) {
        // Handle any potential errors
        console.error('Error fetching user profile details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});