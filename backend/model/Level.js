const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

const Level = mongoose.model("Level", LevelSchema);
module.exports = Level;
