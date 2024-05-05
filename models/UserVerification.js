const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
        id: { 
            type: String,
            required:[true,' Pleas enter your id'],
            unique: true
         },
        home: {
            type: String,
            required: [true, 'Please enter your home'],
        },
        city: {
            type: String,
            required: [true, 'Please enter your city'],
        },
        country: {
            type: String,
            required: [true, 'Please enter your country'],
        },
        regionState: {
            type: String,
            required: [true, 'Please enter your region'],
        },
        nationality: {
            type: String,
            required: [true, 'Please enter your nationality'],
        },
        bankName: {
            type: String,
            required: [true, 'Please enter your bank Name'],
        },
        bankAccountNumber: {
            type: String,
            required: [true, 'Please enter your bank Account Number'],
        },
        accountName: {
            type: String,
            required: [true, 'Please enter your Account Name'],
        },
        rut: {
            type: String,
            required: [true, 'Please enter your rut'],
        },
    addRut: {
        type: String,
        required: [true, 'Please enter your rut'],
    },
});



module.exports = mongoose.model('Verification', documentSchema);
