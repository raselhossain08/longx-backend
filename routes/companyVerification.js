const express = require('express');
const router = express.Router();
const multer = require('multer');
const VerificationModel = require('../models/verificationModel');
const fs = require('fs');
const path = require('path');
const { protectRoute, authorizeRoles } = require('../middleware/auth');
const mongoose = require('mongoose');
// Set up Multer for single file upload
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path.join(__dirname, '../uploads');
            // Create the uploads directory if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Use req.userId to get the user ID
        const userId = req.userId;

        // Create a new document instance
        const document = new VerificationModel({
            _id: userId, // Assign user ID from token
            filename: req.file.originalname,
            path: req.file.path
        });

        // Save the document to the database
        await document.save();

        // Send success response
        res.send('File uploaded successfully.');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file.');
    }
});

router.get('/upload/:userId', async (req, res) => {
    try {
        // Query the database to retrieve documents associated with the user
        const documents = await VerificationModel.find({_id:`65c9fed2a4ec4dac005b7704`})
        console.log(documents)
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Error fetching files.');
    }

    
});

module.exports = router;
