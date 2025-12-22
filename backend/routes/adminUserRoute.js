const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  getAllUsers,
  deleteUser,
  searchUsers,
  getAllFriends,
} = require("../controllers/adminUserController");
const router = express.Router();

// Route lấy danh sách tất cả users
router.get("/", adminAuthMiddleware, getAllUsers);

// Route xóa user theo ID
router.delete("/:userId", adminAuthMiddleware, deleteUser);

// Route tìm kiếm users
router.get("/search", adminAuthMiddleware, searchUsers);

// Lấy danh sách bạn bè của user
router.get("/friends/:userId", adminAuthMiddleware, getAllFriends);

module.exports = router;
