const mongoose = require("mongoose");

const ACHIEVEMENT_TYPES = {
    ROOKIE: 'ROOKIE',           // Tân Binh - 1 mục tiêu
    TRAINEE: 'TRAINEE',        // Tập Sự - 5 mục tiêu
    WARRIOR: 'WARRIOR',        // Chiến Binh - 10 mục tiêu
    ELITE: 'ELITE',            // Tinh Anh - 20 mục tiêu
    MASTER: 'MASTER',          // Cao Thủ - 50 mục tiêu
    GODKING: 'GODKING'         // Thần Vương - 100 mục tiêu
};

const ACHIEVEMENT_DETAILS = {
    [ACHIEVEMENT_TYPES.ROOKIE]: {
        title: 'Tân Binh',
        description: 'Hoàn thành mục tiêu học tập đầu tiên',
        icon: '🌱',
        image: '/study-plant/badges/rookie.png'
    },
    [ACHIEVEMENT_TYPES.TRAINEE]: {
        title: 'Tập Sự',
        description: 'Hoàn thành 5 mục tiêu học tập',
        icon: '📚',
        image: '/study-plant/badges/trainee.png'
    },
    [ACHIEVEMENT_TYPES.WARRIOR]: {
        title: 'Chiến Binh',
        description: 'Hoàn thành 10 mục tiêu học tập',
        icon: '⚔️',
        image: '/study-plant/badges/warrior.png'
    },
    [ACHIEVEMENT_TYPES.ELITE]: {
        title: 'Tinh Anh',
        description: 'Hoàn thành 20 mục tiêu học tập',
        icon: '💫',
        image: '/study-plant/badges/elite.png'
    },
    [ACHIEVEMENT_TYPES.MASTER]: {
        title: 'Cao Thủ',
        description: 'Hoàn thành 50 mục tiêu học tập',
        icon: '🔥',
        image: '/study-plant/badges/master.png'
    },
    [ACHIEVEMENT_TYPES.GODKING]: {
        title: 'Thần Vương',
        description: 'Hoàn thành 100 mục tiêu học tập',
        icon: '👑',
        image: '/study-plant/badges/godking.png'
    }
};

const achievementSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(ACHIEVEMENT_TYPES),
            required: true,
        },
        goals_completed: {
            type: Number,
            required: true,
        },
        unlocked_at: {
            type: Date,
            default: Date.now,
        },
        is_displayed: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

// Virtual fields để lấy thông tin chi tiết của achievement
achievementSchema.virtual('details').get(function () {
    return ACHIEVEMENT_DETAILS[this.type];
});

// Đảm bảo virtuals được bao gồm khi chuyển đổi sang JSON
achievementSchema.set('toJSON', { virtuals: true });
achievementSchema.set('toObject', { virtuals: true });

module.exports = {
    Achievement: mongoose.model("Achievement", achievementSchema),
    ACHIEVEMENT_TYPES,
    ACHIEVEMENT_DETAILS
};