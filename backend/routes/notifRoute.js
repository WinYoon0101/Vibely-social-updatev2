const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require('../config/cloudinary');
const { getMyNotifications, markAllAsRead, markAsRead, markAsUnread } = require('../controllers/notifController');

const router = express.Router();

router.get('/', authMiddleware, getMyNotifications)

router.put('/readAll', authMiddleware, markAllAsRead)
router.post('/read/:notifId', authMiddleware, markAsRead)
router.put('/read/:notifId', authMiddleware, markAsUnread)

module.exports = router;