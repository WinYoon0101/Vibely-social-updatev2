const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser, logoutUser, deleteAccount, changePassword, verifyOTP, sendOTP } = require('../controllers/authController');
const passport = require('passport');
const { generateToken } = require('../utils/generateToken');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', authMiddleware, changePassword);
router.get('/logout', logoutUser);
router.delete('/deleteAccount', authMiddleware, deleteAccount);


// Route gửi OTP
router.post('/send-otp', sendOTP);

// Route xác thực OTP
router.post('/verify-otp', verifyOTP);



//Route Google oauth 
router.get('/google', passport.authenticate('google', {

    scope: ['profile', 'email']
}))

//Route Google callback 
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/user-login`,
        session: false
    }),
    async (req, res) => {
        try {
            if (!req.user) {
                console.error('Lỗi khi gọi Google callback: Không có dữ liệu người dùng');
                return res.redirect(`${process.env.FRONTEND_URL}/user-login?error=no_user_data`);
            }

            //Đảm bảo đối tượng người dùng có tất cả các trường bắt buộc
            const userData = {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role || 'user'
            };

            //Tạo token với dữ liệu người dùng phù hợp
            const accessToken = generateToken(userData);

            if (!accessToken) {
                console.error('Lỗi khi tạo token');
                return res.redirect(`${process.env.FRONTEND_URL}/user-login?error=token_generation_failed`);
            }

            //Tạo cookie với các tùy chọn phù hợp
            res.cookie("auth_token", accessToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 90 * 24 * 60 * 60 * 1000
            });

            //Chuyển hướng đến frontend
            res.redirect(`${process.env.FRONTEND_URL}`);
        } catch (error) {
            console.error('Lỗi khi gọi Google callback:', error);
            res.redirect(`${process.env.FRONTEND_URL}/user-login?error=server_error`);
        }
    }
);
module.exports = router;
