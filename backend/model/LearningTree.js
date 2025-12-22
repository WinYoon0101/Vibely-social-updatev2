const mongoose = require("mongoose");

const TREE_TYPES = {
    CACTUS: 'cactus',
    GREEN_TREE: 'green_tree',
    SUNFLOWER: 'sunflower'
};

const learningTreeSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tree_type: {
            type: String,
            enum: Object.values(TREE_TYPES),
            required: true,
        },
        growth_stage: {
            type: Number,
            default: 0,  // Bắt đầu là Tân Binh
            min: 0,
            max: 4,
        },
        completed_goals_count: {
            type: Number,
            default: 0,
        },
        last_updated: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

// Middleware để cập nhật growth_stage dựa trên số mục tiêu hoàn thành
learningTreeSchema.pre('save', function (next) {
    if (this.completed_goals_count >= 100) {
        this.growth_stage = 5;  // Thần Vương
    } else if (this.completed_goals_count >= 50) {
        this.growth_stage = 4;  // Cao Thủ
    } else if (this.completed_goals_count >= 20) {
        this.growth_stage = 3;  // Tinh Anh
    } else if (this.completed_goals_count >= 10) {
        this.growth_stage = 2;  // Chiến Binh
    } else if (this.completed_goals_count >= 5) {
        this.growth_stage = 1;  // Tập Sự
    } else {
        this.growth_stage = 0;  // Tân Binh
    }
    next();
});

module.exports = {
    LearningTree: mongoose.model("LearningTree", learningTreeSchema),
    TREE_TYPES
}; 