const express = require('express');
const router = express.Router();
const { getPersonVerification, uploadFiles } = require('../controller/Verification/PersonVerification');
const { protectRoute, authorizeRoles } = require('../middleware/auth')
// GET documents verification by user ID
router.get('/:userId', protectRoute, getPersonVerification);

// POST upload documents verification
router.post('/person/upload', protectRoute, uploadFiles);

module.exports = router;
