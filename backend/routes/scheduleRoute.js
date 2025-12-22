const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createSchedule,
  getUserSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getScheduleByIdUser
} = require('../controllers/scheduleController');

const router = express.Router();

// Route tạo lịch trình mới
router.post('/', authMiddleware, createSchedule);

// Route lấy tất cả lịch trình của người dùng
router.get('/', authMiddleware, getUserSchedules);

// Route lấy chi tiết một lịch trình theo ID
router.get('/:scheduleId', authMiddleware, getScheduleById);

// Route lấy chi tiết một lịch trình theo ID người dùng
router.get('/user/:userId', authMiddleware, getScheduleByIdUser);

// Route cập nhật lịch trình
router.put('/:scheduleId', authMiddleware, updateSchedule);

// Route xóa lịch trình
router.delete('/:scheduleId', authMiddleware, deleteSchedule);

module.exports = router;
