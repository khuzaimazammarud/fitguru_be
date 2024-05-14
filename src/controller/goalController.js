const GoalModel = require("../models/goal");

const createGoal = async (req, res) => {
  const dailygoal = req.body;
  try {
    const newGoal = new GoalModel(dailygoal);
    const saveGoal = await newGoal.save();

    if (!saveGoal) {
      throw "goal not create";
    }

    res.status(201).json({
      success: "goal created",
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getGoalByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const goal = await GoalModel.findOne({ user: userId }).populate('user', 'weight');

    if (!goal) {
      throw "goal not found";
    }

    res.status(200).json({ goal });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { createGoal, getGoalByUserId };
