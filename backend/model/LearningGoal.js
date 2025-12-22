const mongoose = require("mongoose");

const learningGoalSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            maxLength: 200
        },
        is_completed: {
            type: Boolean,
            default: false,
        },
        completed_at: {
            type: Date,
        },
        is_visible: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

// Middleware để kiểm tra số lượng mục tiêu chưa hoàn thành
learningGoalSchema.pre('save', async function (next) {
    if (this.isNew) {  // Chỉ kiểm tra khi tạo mục tiêu mới
        const incompleteGoalsCount = await this.constructor.countDocuments({
            user_id: this.user_id,
            is_completed: false
        });

        if (incompleteGoalsCount >= 5) {
            return next(new Error("Bạn đã có 5 mục tiêu chưa hoàn thành. Không thể tạo thêm."));

        }
    }
    next();
});

module.exports = mongoose.model("LearningGoal", learningGoalSchema); 