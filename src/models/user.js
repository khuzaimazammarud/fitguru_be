const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    confirmPassword : {
        type : String,
        require : false
    },
    gender: {
        type: String,
        require: true
    },
    age : {
        type: Number,
        require: true
    },
    weight : {
        type: Number,
        require: true
    },
    height : {
        type: Number,
        require: true
    },
    verified : {
        type : Boolean,
        default : false
    },
    otp: {
        type: Number,
        require: false
    }
}, {timestamps : true});

module.exports = mongoose.model("User", UserSchema);