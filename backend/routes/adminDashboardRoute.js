const express = require('express');
const router = express.Router();
const { getAdminDashboard, getTotalUsers, getTotalDocuments, getTotalInquiries, getTotalPosts, getDashboardStats } = require('../controllers/adminDashboardController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// Route lấy thông tin dashboard admin
router.get('/dashboard', adminAuthMiddleware, getAdminDashboard);
router.get('/dashboard/total-users', adminAuthMiddleware, getTotalUsers);
router.get('/dashboard/total-documents', adminAuthMiddleware, getTotalDocuments);
router.get('/dashboard/total-inquiries', adminAuthMiddleware, getTotalInquiries);
router.get('/dashboard/total-posts', adminAuthMiddleware, getTotalPosts);
router.get('/dashboard/stats', adminAuthMiddleware, getDashboardStats);
module.exports = router;