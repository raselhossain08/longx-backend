const express = require('express');
const router = express.Router();
const { getDocumentsVerification, uploadFiles } = require('../controller/Verification/DocumentsVerification');
const { protectRoute, authorizeRoles } = require('../middleware/auth')
// GET documents verification by user ID
router.get('/:userId', protectRoute, getDocumentsVerification);

// POST upload documents verification
router.post('/company/upload', protectRoute, uploadFiles);

module.exports = router;
