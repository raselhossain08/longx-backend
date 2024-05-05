const  mongoose  = require('mongoose')

const documentSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filename: String,
    path: String
  });
module.exports =mongoose.model('company_verification',documentSchema)