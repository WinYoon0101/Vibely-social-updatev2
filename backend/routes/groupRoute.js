const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require('../config/cloudinary')
const { getMyGroups, createGroup, getOtherGroups, joinGroup, getGroupById, leaveGroup, editGroup, createGroupPost, addAdmin, removeAdmin, kickMember, getAllGroups, getRequests, approveRequest, rejectRequest, inviteFriend, acceptInvitation } = require('../controllers/groupController');
const router = express.Router();

router.get('/', authMiddleware, getMyGroups);
router.get('/other', authMiddleware, getOtherGroups);
router.get('/all', authMiddleware, getAllGroups);

router.post('/create', authMiddleware, multerMiddleware.single('media'), createGroup)
router.post('/join/:groupId', authMiddleware, joinGroup)
router.put('/join/:groupId', authMiddleware, leaveGroup)
router.get('/:groupId', authMiddleware, getGroupById)
router.put('/:groupId', authMiddleware, multerMiddleware.single('media'), editGroup)
router.post('/:groupId', authMiddleware, multerMiddleware.single('media'), createGroupPost)

router.post('/:groupId/admins/:userId', authMiddleware, addAdmin)
router.put('/:groupId/admins/:userId', authMiddleware, removeAdmin)

router.post('/:groupId/kick/:userId', authMiddleware, kickMember)

router.get('/:groupId/requests', authMiddleware, getRequests)
router.post('/:groupId/requests', authMiddleware, approveRequest)
router.put('/:groupId/requests', authMiddleware, rejectRequest)

router.post('/:groupId/invite/', authMiddleware, inviteFriend)
router.put('/:groupId/invite/', authMiddleware, acceptInvitation)

module.exports = router;