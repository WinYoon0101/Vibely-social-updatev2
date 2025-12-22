const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        mediaUrl: { type: String },
        mediaType: { type: String, enum: ['image', 'video'] },
        reactions: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
        reactionStats: { tym: { type: Number, default: 0 } },
    },
    { timestamps: true }
);

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
