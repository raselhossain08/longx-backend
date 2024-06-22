const express = require('express');
const router = express.Router();
const { getCompanyVerification, uploadFiles,getFilenamesByUserId } = require('../controller/Verification/CompanyVerification');
const { protectRoute, authorizeRoles } = require('../middleware/auth')
// GET documents verification by user ID
// router.get('/files/:userId', protectRoute, getCompanyVerification);
router.get('/files/:userId', protectRoute, getFilenamesByUserId);

// POST upload documents verification
router.post('/company/upload', protectRoute, uploadFiles);

module.exports = router;
