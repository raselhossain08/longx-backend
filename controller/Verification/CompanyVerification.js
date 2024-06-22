const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CompanyVerificationModel = require('../../models/CompanyVerification');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
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
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array('files', 10); // 'files' is the name of the field for multiple files, 10 is the maximum number of files allowed

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
    cb('Error: Images and PDFs Only!');
  }
}

// Get Documents Verification by User ID
const getCompanyVerification = async (req, res) => {
  try {
    const userId = req.params.userId;
    const documents = await CompanyVerificationModel.find({ userId: userId });
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
        return res.status(400).json({ error: err });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Save file info to database
      const filePromises = req.files.map(async (file) => {
        const newFile = new CompanyVerificationModel({
          userId: userId,
          filename: file.filename,
          // Other file properties you might want to save
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
const getFilenamesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const documents = await CompanyVerificationModel.find({ userId: userId });

    if (!documents) {
      return res.status(404).json({ error: 'Files not found' });
    }

    const fileInfos = documents.map(doc => ({
      filename: doc.filename,
      url: `/uploads/${doc.filename}`
    }));

    res.status(200).json(fileInfos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getCompanyVerification,getFilenamesByUserId, uploadFiles };
