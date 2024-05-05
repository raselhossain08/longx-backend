// models/PriceModel.js

const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    usdtPrice: {
        type: Number,
        required: true
    },
    clpPrice: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const PriceModel = mongoose.model('Price', priceSchema);

module.exports = PriceModel;
