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
    verified : {
        type : Boolean,
        default : false
    }
}, {timestamps : true});

module.exports = mongoose.model("User", UserSchema);