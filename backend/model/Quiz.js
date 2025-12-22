const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    mainQuestion: { type: String, required: true },
    choices: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    answeredResult: { type: Number, default: -1 },
    statistics: {
        totalAttempts: { type: Number, default: 0 },
        correctAttempts: { type: Number, default: 0 },
        incorrectAttempts: { type: Number, default: 0 },
    },
});

const quizSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    quizTitle: { type: String, required: true },
    quizQuestions: [questionSchema],
});

module.exports = mongoose.model('Quiz', quizSchema);