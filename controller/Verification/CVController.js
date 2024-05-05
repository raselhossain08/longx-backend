const VerificationModel = require('../../models/verificationModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

// Set up Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        // Create the uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

exports.companyVerification = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    // Save document details to MongoDB
    try {
        const documents = [];
        for (const file of req.files) {
            const document = new VerificationModel({
                userId: req.body.userId, // Assuming userId is sent in the request body
                filename: file.originalname,
                path: file.path
            });
            documents.push(document);
        }
        await VerificationModel.insertMany(documents);
        res.send('Files uploaded successfully.');
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).send('Error uploading files.');
    }
});
