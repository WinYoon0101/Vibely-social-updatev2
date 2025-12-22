const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
    createTree,
    getTree,
    updateTreeType
} = require('../controllers/learningTreeController');

// Tất cả routes đều yêu cầu authentication
router.use(auth);

// Route cho cây học tập
router.post('/', createTree);
router.get('/', getTree);
router.patch('/type', updateTreeType);

// Route để kiểm tra cây hiện tại
router.get('/current', getTree);

module.exports = router; 