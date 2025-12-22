const express = require("express");
const router = express.Router();
const { loginAdmin, logoutAdmin, checkAuth } = require("../controllers/adminAuthController");
const { updateAdminPassword } = require("../controllers/adminUpdatePassword");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Route đăng nhập admin
router.post("/login", loginAdmin);

// Route kiểm tra xác thực admin
router.get("/check-auth", adminAuthMiddleware, checkAuth);

// Route đăng xuất admin
router.post("/logout", logoutAdmin);

// Route cập nhật mật khẩu admin
router.put("/update-password", adminAuthMiddleware, updateAdminPassword);

module.exports = router;
