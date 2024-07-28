const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PersonVerification = require('../../models/PersonVerification');

// Set the upload directory
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array('files', 4); // 'files' is the name of the field for multiple files, 4 is the maximum number of files allowed

// Check File Type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only images (JPEG, JPG, PNG) and PDFs are allowed!');
  }
}

// Get Documents Verification by User ID
const getPersonVerification = async (req, res) => {
  try {
    const userId = req.params.userId;
    const documents = await PersonVerification.find({ userId: userId });
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Handle File Upload
const uploadFiles = async (req, res) => {
  try {
    // Assuming you have user authentication implemented and userId is available in req.user
    const userId = req.user._id;

    upload(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'Unexpected field' });
        }
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Save file info to database
      const filePromises = req.files.map(async (file) => {
        const newFile = new PersonVerification({
          userId: userId,
          filename: file.filename,
          // Add other file properties you might want to save here
        });
        await newFile.save();
        return newFile;
      });

      const savedFiles = await Promise.all(filePromises);
      res.status(200).json({ files: savedFiles });
      console.log(savedFiles)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getPersonVerification, uploadFiles };
