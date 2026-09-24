const User = require('../model/User');
const { Resend } = require('resend');
const bcrypt = require('bcryptjs');
const getEmailTemplate = require('../utils/emailTemplate');

// Khởi tạo Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Tạo mã xác thực ngẫu nhiên 6 số
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

// Gửi mã xác thực qua email
exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
        }

        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // Mã hết hạn sau 10 phút
        await user.save();

        const htmlContent = getEmailTemplate(
            'Khôi phục mật khẩu Vibely',
            `Mã xác thực của bạn là: ${verificationCode}`,
            `
            <p>Chào bạn,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Vibely của bạn. Vui lòng sử dụng mã xác thực dưới đây để tiến hành đặt lại mật khẩu:</p>
            <div class="otp-box">
                <p class="otp-code">${verificationCode}</p>
            </div>
            <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, xin hãy bỏ qua email này.</p>
            `
        );

        // Gửi email bằng Resend
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_USER || 'Vibely <onboarding@resend.dev>',
            to: email,
            subject: 'Mã xác thực đặt lại mật khẩu - Vibely',
            html: htmlContent
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: 'Đã gửi mã xác thực qua email' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xác thực mã code
exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        }

        if (user.verificationCode.toString().trim() !== code.toString().trim()) {
            return res.status(400).json({ message: 'Mã xác thực không chính xác' });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'Mã xác thực đã hết hạn' });
        }

        res.status(200).json({ message: 'Xác thực thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        }

        if (user.verificationCode.toString().trim() !== code.toString().trim()) {
            return res.status(400).json({ message: 'Mã xác thực không chính xác' });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'Mã xác thực đã hết hạn' });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu và xóa mã xác thực
        user.password = hashedPassword;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};