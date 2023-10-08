const GoalModel = require("../models/goal");

const createGoal = async (req, res) => {
    const dailygoal = req.body;
    console.log("🚀 ~ file: goalController.js:5 ~ createGoal ~ req.body:", req.body)

    try {
        const newGoal = new GoalModel(dailygoal);
        const saveGoal = await newGoal.save();

        if(!saveGoal) {
            throw "goal not create"    
        }

        res.status(201).json({
            success : "goal created"
        })
    }catch(error) { 
        console.log("🚀 ~ file: goalController.js:19 ~ createGoal ~ error:", error)
        res.status(400).json(error);
    }
}

const getGoal = (req, res) => {
    res.status(200).json({message : "helo motto"});
}

module.exports = {createGoal, getGoal};
