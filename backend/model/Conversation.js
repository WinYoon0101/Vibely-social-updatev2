const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
        nicknames: {
            type: Map,
            of: String,
        },
        color: {
            type: String,
            default: "#30BDFF"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);