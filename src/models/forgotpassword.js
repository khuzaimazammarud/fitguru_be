const mongoose = require("mongoose");

const ForgotPassword = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    otp: {
        type: String,
        require: true
    },
}, {timestamps : true});

module.exports = mongoose.model("forgot", ForgotPassword);