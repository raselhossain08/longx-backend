const express = require('express');
const { getAllUsers, deleteUserById ,updateUserWallet,getUserProfileWallet,updateUserBalance} = require('../../controller/admin/UserDetailsController');
const { protectRoute } = require('../../middleware/auth');
const router = express.Router();


// Route to get all users
router.get('/admin/users', getAllUsers,protectRoute);
router.get('/admin/users/balance/:id', getUserProfileWallet,protectRoute);

// Route to update a user by ID
router.put('/admin/users/balance/:id', updateUserBalance,protectRoute);
router.put('admin/users/wallet/:id',updateUserWallet,protectRoute);
// Route to delete a user by ID
router.delete('/admin/users/:id',deleteUserById,protectRoute);
module.exports = router;

