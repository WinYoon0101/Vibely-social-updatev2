const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        level: { type: mongoose.Schema.Types.ObjectId, ref: "Level", required: true },
    },
    { timestamps: true }
);

const Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
