const CompanyVerification = require('../models/verificationModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const axios = require('axios');
const PriceModel = require('../models/PriceModel');

exports.usdtPrice =catchAsyncErrors(async(req,res,next)=>{
    const usdtRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
    const usdtPrices = usdtRes.data.tether.usd;
    res.json({ 
        success: true,
        usdtPrices,
    });
})

exports.CryptoClpPrice =catchAsyncErrors(async(req,res,next)=>{
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=clp');
        const clpPrice = response.data.tether.clp;
        console.log('Current CLP Price:', clpPrice);
        res.json({ 
            success: true,
            clpPrice // corrected variable name
        });
    } catch (error) {
        console.error('Error fetching CLP price:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

exports.CryptoRwaPrice =catchAsyncErrors(async(req,res,next)=>{
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rwa');
        const rwaPrice = response.data.tether.rwa;
        console.log('Current CLP Price:', rwaPrice);
        res.json({ 
            success: true,
            rwaPrice // corrected variable name
        });
    } catch (error) {
        console.error('Error fetching CLP price:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})



exports.cryptoPrice = async (req, res, next) => {
    try {
        const latestPriceData = await PriceModel.findOne({}, {}, { sort: { 'timestamp': -1 } });
        if (!latestPriceData) {
            return res.status(400).json({ success: false, message: "Server Error" });
        }
        const { usdtPrice, clpPrice, timestamp } = latestPriceData;
        res.status(200).json({ success: true, timestamp, usdtPrice, clpPrice });
    } catch (error) {
        console.error('Error getting latest price data:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.ChartPrice =catchAsyncErrors(async (req, res,next) => {
    // routes/prices.js
        try {
            const data = await PriceModel.find().sort({ timestamp: -1 }).limit(24); // Get last 24 hours data
            res.json({ success: true, data });
        } catch (error) {
            console.error('Error fetching price data:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

})
