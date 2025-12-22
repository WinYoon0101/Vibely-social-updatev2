const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        pages: { type: Number, required: true },
        level: { type: mongoose.Schema.Types.ObjectId, ref: "Level", required: true },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
        fileType: { type: String, required: true },
        uploadDate: { type: Date, default: Date.now },
        fileUrl: { type: String, required: true },
    },
    { timestamps: true }
);

const Document = mongoose.model("Document", DocumentSchema);
module.exports = Document;
