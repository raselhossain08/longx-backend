const express = require("express");
const multer = require("multer");
const { uploadKycDetails, getKycApplications, updateKycStatus } = require("../controller/kycController");

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // Corrected `file.originalname`
});
const upload = multer({ storage });

// Routes
router.post("/kyc", upload.fields([{ name: "idProof" }, { name: "addressProof" }]), uploadKycDetails);
router.get("/admin/kyc", getKycApplications);
router.patch("/admin/kyc/:id", updateKycStatus);

module.exports = router;
