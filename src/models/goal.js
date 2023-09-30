const mongoose = require("mongoose");

const GoalSchema = mongoose.Schema({
    dailygoal : {
        type : Number,
        require : true
    },
    currentgoal : {
        type : Number,
    }
}, {timestamps : true});

module.exports = mongoose.model("Goal", GoalSchema);