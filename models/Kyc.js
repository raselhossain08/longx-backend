const mongoose = require("mongoose");

const KycSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  city: String,
  state: String,
  zipCode: String,
  nationality: String,
  idProofUrl: String, // Cloudinary URL
  addressProofUrl: String, // Cloudinary URL
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Kyc", KycSchema);
