const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const response = require("../utils/responseHandler");

const updateAdminPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Kiểm tra xem người dùng đã nhập đầy đủ thông tin chưa
        if (!oldPassword || !newPassword) {
            return response(res, 400, "Vui lòng nhập đầy đủ mật khẩu cũ và mới");
        }

        // Lấy token từ cookies
        const token = req.cookies.admin_token;
        if (!token) {
            return response(res, 401, "Bạn cần đăng nhập để thực hiện thao tác này");
        }

        // Xác thực token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return response(res, 403, "Token không hợp lệ hoặc đã hết hạn");
        }

        // Tìm admin theo ID từ token
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return response(res, 404, "Admin không tồn tại");
        }

        // Kiểm tra xem mật khẩu trong database có tồn tại không
        if (!admin.password) {
            return response(res, 500, "Lỗi dữ liệu: Không tìm thấy mật khẩu admin");
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return response(res, 400, "Mật khẩu cũ không chính xác");
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu trong database
        admin.password = hashedPassword;
        await admin.save();

        return response(res, 200, "Cập nhật mật khẩu thành công");
    } catch (error) {
        console.error("Lỗi khi cập nhật mật khẩu:", error);
        return response(res, 500, "Lỗi server");
    }
};

module.exports = { updateAdminPassword };
