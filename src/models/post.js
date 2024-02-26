const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false,
    },
    comments: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        default: []
    },
    likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);