const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ cookie hoặc Authorization header
        const authToken = req?.cookies?.auth_token || req?.headers?.authorization?.split(" ")[1];

        if (!authToken) {
            return response(res, 401, "Bạn cần đăng nhập để thực hiện thao tác này");
        }

        // Xác thực token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        // Lấy thông tin user từ database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return response(res, 401, "Người dùng không tồn tại");
        }

        // Gán thông tin user vào request
        req.user = {
            ...decoded,
            _id: user._id,
            user_id: user._id,
            ...user.toObject()
        };

        next();
    } catch (error) {
        console.error("Lỗi xác thực:", error.message);

        // Nếu có socket.io instance, xóa user khỏi danh sách online
        if (req.app.get('io')) {
            const io = req.app.get('io');
            const userId = req?.user?._id;
            if (userId) {
                io.emit("userOffline", userId);
            }
        }

        return response(res, 401, "Token không hợp lệ hoặc đã hết hạn");
    }
};

module.exports = authMiddleware;