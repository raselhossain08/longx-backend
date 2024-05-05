const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  filename: {
    type: String,
    required: true
  },
  // Other file properties
});

const DocumentsVerification = mongoose.model('DocumentsVerification', fileSchema);

module.exports = DocumentsVerification;
