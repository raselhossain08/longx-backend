const Kyc = require("../models/Kyc");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadKycDetails = async (req, res) => {
  try {
    // Upload files to Cloudinary
    const idProofResult = await cloudinary.uploader.upload(req.files["idProof"][0].path);
    const addressProofResult = await cloudinary.uploader.upload(req.files["addressProof"][0].path);

    // Save KYC data to MongoDB
    const kycData = new Kyc({
      fullName: req.body.fullName,
      email: req.body.email,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      nationality: req.body.nationality,
      idProofUrl: idProofResult.secure_url,
      addressProofUrl: addressProofResult.secure_url,
    });

    await kycData.save();
    res.status(201).json({ message: "KYC details submitted successfully", kycData });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit KYC details" });
  }
};

exports.getKycApplications = async (req, res) => {
  try {
    const kycApplications = await Kyc.find();
    res.json(kycApplications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch KYC applications" });
  }
};

exports.updateKycStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await Kyc.findByIdAndUpdate(id, { status });
    res.json({ message: `KYC ${status}` });
  } catch (error) {
    res.status(500).json({ error: `Failed to update KYC status to ${status}` });
  }
};
