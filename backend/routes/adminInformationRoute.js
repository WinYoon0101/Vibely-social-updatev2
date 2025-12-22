const express = require("express");
const { getAdminInfo, updateAdminInfo, uploadProfilePicture } = require('../controllers/adminInformationController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { multerMiddleware } = require('../config/cloudinary');

const router = express.Router();
// Route lấy thông tin admin
router.get('/account/:id', adminAuthMiddleware, getAdminInfo);

// Route cập nhật thông tin admin
router.put('/account/:id', adminAuthMiddleware, updateAdminInfo);

// Route upload ảnh đại diện
router.post('/account', adminAuthMiddleware, multerMiddleware.single('profilePicture'), uploadProfilePicture);
module.exports = router;