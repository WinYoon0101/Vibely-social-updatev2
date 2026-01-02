const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
    {
        name:{ type: String, required: true },
        description:{ type: String },
        coverPhotoUrl:{ type: String },
        privacySetting:{ type: String, enum: ["public", "private"], default: "public" },
        members:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        admins:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        posts:[{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        invited:{ type: [mongoose.Schema.Types.ObjectId], ref: "User" },
        waitingRequests:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema );
module.exports = Group;
