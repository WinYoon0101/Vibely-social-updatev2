const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler");
const Admin = require("../model/Admin");

const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Bỏ qua middleware nếu là route đăng nhập
        if (req.path === '/admin/auth/login') {
            return next();
        }

        // Lấy token từ cookie hoặc header
        const token = req?.cookies?.admin_token || req?.headers?.authorization?.split(" ")[1];

        if (!token) {
            return response(res, 401, "Bạn cần đăng nhập với quyền admin để thực hiện thao tác này");
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra user có phải admin không
        const admin = await Admin.findById(decoded.id);
        if (!admin || admin.role !== "admin") {
            return response(res, 403, "Bạn không có quyền truy cập");
        }

        // Kiểm tra token có phải là token mới nhất không
        if (admin.lastLogin && decoded.iat < admin.lastLogin.getTime() / 1000) {
            return response(res, 401, "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        }

        req.admin = admin;
        next();
    } catch (error) {
        return response(res, 401, "Token không hợp lệ hoặc đã hết hạn");
    }
};

module.exports = adminAuthMiddleware;
