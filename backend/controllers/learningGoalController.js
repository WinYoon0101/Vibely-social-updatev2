const LearningGoal = require('../model/LearningGoal');
const LearningTree = require('../model/LearningTree').LearningTree;
const { Achievement, ACHIEVEMENT_TYPES, ACHIEVEMENT_DETAILS } = require('../model/Achievement');

// Tạo mục tiêu mới
const createGoal = async (req, res) => {
    try {
        const { title } = req.body;

        // Tạo mục tiêu mới (middleware trong model sẽ kiểm tra giới hạn 5 mục tiêu)
        const goal = await LearningGoal.create({
            user_id: req.user.user_id,
            title
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy danh sách mục tiêu
const getGoals = async (req, res) => {
    try {
        const goals = await LearningGoal.find({ user_id: req.user.user_id })
            .sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật mục tiêu
const updateGoal = async (req, res) => {
    try {
        const { title } = req.body;
        const goal = await LearningGoal.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.user_id },
            { title },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ message: 'Mục tiêu không tồn tại' });
        }

        res.json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa mục tiêu
const deleteGoal = async (req, res) => {
    try {
        console.log('Delete request details:', {
            goalId: req.params.id,
            userId: req.user.user_id,
            token: req.headers.authorization
        });

        // Kiểm tra xem mục tiêu có tồn tại không
        const existingGoal = await LearningGoal.findOne({
            _id: req.params.id
        });
        console.log('Existing goal:', existingGoal);

        if (!existingGoal) {
            return res.status(404).json({ message: 'Mục tiêu không tồn tại' });
        }

        // Kiểm tra quyền sở hữu
        if (existingGoal.user_id.toString() !== req.user.user_id) {
            return res.status(403).json({ message: 'Không có quyền xóa mục tiêu này' });
        }

        const goal = await LearningGoal.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.user_id
        });

        console.log('Delete result:', goal);

        if (!goal) {
            return res.status(404).json({ message: 'Mục tiêu không tồn tại' });
        }

        res.json({ message: 'Đã xóa mục tiêu' });
    } catch (error) {
        console.error('Error in deleteGoal:', error);
        res.status(500).json({ message: error.message });
    }
};

// Kiểm tra và cập nhật achievement
const checkAndUpdateAchievements = async (userId, completedCount) => {
    const achievementChecks = [
        { type: ACHIEVEMENT_TYPES.ROOKIE, threshold: 1 },      // Tân Binh
        { type: ACHIEVEMENT_TYPES.TRAINEE, threshold: 5 },     // Tập Sự
        { type: ACHIEVEMENT_TYPES.WARRIOR, threshold: 10 },    // Chiến Binh
        { type: ACHIEVEMENT_TYPES.ELITE, threshold: 20 },      // Tinh Anh
        { type: ACHIEVEMENT_TYPES.MASTER, threshold: 50 },     // Cao Thủ
        { type: ACHIEVEMENT_TYPES.GODKING, threshold: 100 }    // Thần Vương
    ];

    let newAchievements = [];

    for (const check of achievementChecks) {
        if (completedCount >= check.threshold) {
            // Kiểm tra xem đã có achievement này chưa
            const existingAchievement = await Achievement.findOne({
                user_id: userId,
                type: check.type
            });

            if (!existingAchievement) {
                const newAchievement = await Achievement.create({
                    user_id: userId,
                    type: check.type,
                    goals_completed: completedCount
                });
                newAchievements.push(newAchievement);
            }
        }
    }

    return newAchievements;
};

// Toggle trạng thái hoàn thành của mục tiêu
const toggleGoalCompletion = async (req, res) => {
    try {
        const goal = await LearningGoal.findOne({
            _id: req.params.id,
            user_id: req.user.user_id
        });

        if (!goal) {
            return res.status(404).json({ message: 'Mục tiêu không tồn tại' });
        }

        // Toggle trạng thái
        goal.is_completed = !goal.is_completed;

        if (goal.is_completed) {
            goal.completed_at = Date.now();
        } else {
            goal.completed_at = null;
        }

        await goal.save();

        // Nếu mục tiêu được hoàn thành, cập nhật cây và kiểm tra achievement
        if (goal.is_completed) {

            // Đếm tổng số mục tiêu đã hoàn thành
            const completedCount = await LearningGoal.countDocuments({
                user_id: req.user.user_id,
                is_completed: true
            });

            // Cập nhật cây
            const tree = await LearningTree.findOne({ user_id: req.user.user_id });
            if (tree) {
                tree.completed_goals_count = completedCount;
                await tree.save();
            }

            // Kiểm tra và tạo achievement Rookie ngay khi hoàn thành 1 mục tiêu
            let newAchievements = [];
            const existingRookie = await Achievement.findOne({
                user_id: req.user.user_id,
                type: ACHIEVEMENT_TYPES.ROOKIE
            });

            if (!existingRookie) {
                const rookieAchievement = await Achievement.create({
                    user_id: req.user.user_id,
                    type: ACHIEVEMENT_TYPES.ROOKIE,
                    goals_completed: 1,
                    unlocked_at: Date.now()
                });
                newAchievements.push(rookieAchievement);
            }

            // Kiểm tra các achievement khác
            const otherAchievements = await checkAndUpdateAchievements(req.user.user_id, completedCount);
            newAchievements = [...newAchievements, ...otherAchievements];

            // Lấy thông tin chi tiết của achievements
            const achievementsWithDetails = newAchievements.map(achievement => ({
                ...achievement.toObject(),
                details: ACHIEVEMENT_DETAILS[achievement.type]
            }));


            res.json({
                goal,
                tree,
                newAchievements: achievementsWithDetails,
                completedCount,
                showNotification: newAchievements.length > 0,
                notificationType: newAchievements[0]?.type || null
            });
        } else {
            res.json({ goal });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Trạng thái hiển thị của mục tiêu
const toggleGoalVisibility = async (req, res) => {
    try {
        const goal = await LearningGoal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: "Không tìm thấy mục tiêu" });
        }

        // Chỉ cho phép ẩn mục tiêu đã hoàn thành
        if (!goal.is_completed) {
            return res.status(400).json({ message: "Chỉ có thể ẩn mục tiêu đã hoàn thành" });
        }

        goal.is_visible = !goal.is_visible;
        await goal.save();

        res.json(goal);
    } catch (error) {
        console.error('Error toggling goal visibility:', error);
        res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật trạng thái hiển thị" });
    }
};

module.exports = {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    toggleGoalCompletion,
    toggleGoalVisibility
}; 