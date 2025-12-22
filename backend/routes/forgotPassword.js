const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

// Route gửi mã xác thực
router.post('/send-code', forgotPasswordController.sendVerificationCode);

// Route xác thực mã code
router.post('/verify-code', forgotPasswordController.verifyCode);

// Route đặt lại mật khẩu
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;