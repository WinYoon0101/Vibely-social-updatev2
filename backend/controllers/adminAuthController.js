const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const response = require("../utils/responseHandler");

// Đăng nhập cho admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return response(res, 400, "Email hoặc mật khẩu không chính xác");
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return response(res, 400, "Email hoặc mật khẩu không chính xác");
        }

        // Cập nhật thời gian đăng nhập cuối
        admin.lastLogin = new Date();
        await admin.save();

        const token = jwt.sign(
            {
                id: admin._id,
                role: "admin",
                iat: Math.floor(Date.now() / 1000)
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Lưu token vào cookie
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        // Trả về token trong response
        return response(res, 200, "Đăng nhập thành công", {
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        return response(res, 500, "Lỗi server");
    }
};

// Đăng xuất cho admin
const logoutAdmin = (req, res) => {
    res.clearCookie("admin_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    return response(res, 200, "Đăng xuất thành công");
};

// Kiểm tra xác thực admin
const checkAuth = (req, res) => {
    return response(res, 200, "Đã xác thực", {
        admin: {
            id: req.admin._id,
            email: req.admin.email,
            role: req.admin.role
        }
    });
};

module.exports = { loginAdmin, logoutAdmin, checkAuth };
