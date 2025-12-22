const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const { createInquiry } = require("../controllers/inquiryController");

// Route gửi yêu cầu hỗ trợ
router.post("/", authMiddleware, createInquiry);

module.exports = router;