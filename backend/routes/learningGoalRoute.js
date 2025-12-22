const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    toggleGoalCompletion,
    toggleGoalVisibility
} = require('../controllers/learningGoalController');

router.use(auth);

// Route tạo mục tiêu học tập mới
router.post('/', createGoal);

// Route lấy danh sách mục tiêu học tập
router.get('/', getGoals);

// Route cập nhật mục tiêu học tập theo ID
router.put('/:id', updateGoal);

// Route xóa mục tiêu học tập theo ID
router.delete('/:id', deleteGoal);

// Route cập nhật trạng thái hoàn thành của mục tiêu học tập theo ID
router.patch('/:id/toggle', toggleGoalCompletion);

// Route cập nhật trạng thái hiển thị của mục tiêu học tập theo ID
router.patch('/:id/visibility', toggleGoalVisibility);

module.exports = router; 