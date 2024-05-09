"use strict";

const dailyProgressModel = require("../models/dailyProgress");
const mongoose = require("mongoose");

const logEntry = async (req, res) => {
  try {
    console.log("hello");
    const { goal, timeOfDay, calories, protein, fats, carbs, foods } = req.body;
    const newEntry = new dailyProgressModel({
      goal,
      timeOfDay,
      calories,
      protein,
      fats,
      carbs,
      foods,
    });
    const saveEntry = await newEntry.save();
    res.status(201).json({
      success: "Entry created",
      data: saveEntry,
    });
  } catch (error) {
    console.log("🚀 ~ logEntry ~ error:", error);
  }
};

const getEntry = async (req, res) => {
  try {
    const { goal } = req.body;
    const getEntry = await dailyProgressModel.find({ goal });
    res.status(200).json({ data: getEntry });
  } catch (error) {
    console.log("🚀 ~ getEntry ~ error:", error);
  }
};

const getEntryInDateRange = async (req, res) => {
  try {
    const { goal, startDate, endDate } = req.body;

    const getEntry = await dailyProgressModel.aggregate([
      {
        $match: {
          goal: new mongoose.Types.ObjectId(goal),
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { goal: "$goal", date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
          fats: { $sum: "$fats" },
          proteins: { $sum: "$protein" },
          carbs: { $sum: "$carbs" },
          calories: { $sum: "$calories" },
          foods: { $addToSet: "$foods" },
        },
      },
      {
        $project: {
          _id: 0,
          goal: "$_id.goal",
          fats: 1,
          proteins: 1,
          carbs: 1,
          calories: 1,
          foods: { $reduce: { input: "$foods", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } },
          date: "$_id.date",
        },
      },
    ]);    

    res.status(200).json({ data: getEntry });
  } catch (error) {
    console.log("🚀 ~ getEntryInDateRange ~ error:", error);
  }
};

module.exports = {
  logEntry,
  getEntry,
  getEntryInDateRange,
};
