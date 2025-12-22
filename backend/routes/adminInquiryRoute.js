const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const router = express.Router();
const {
    getInquiries,
    updateInquiry,
    deleteInquiry
} = require("../controllers/adminInquiryController");

// Route lấy tất cả các yêu cầu từ người dùng
router.get("/", adminAuthMiddleware, getInquiries);

// Route cập nhật trạng thái yêu cầu từ người dùng
router.put("/:id", adminAuthMiddleware, updateInquiry);

// Route xóa yêu cầu từ người dùng
router.delete("/:id", adminAuthMiddleware, deleteInquiry);

module.exports = router; 