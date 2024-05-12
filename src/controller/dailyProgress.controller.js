"use strict";

const dailyProgressModel = require("../models/dailyProgress");
const goalModel = require("../models/goal");
const mongoose = require("mongoose");


const calculateProgress = (totals, goal) => {
  const { totalCalories, totalProtein, totalCarbs, totalFats } = totals;
  const { dailyCalories, dailyProtein, dailyCarbs, dailyFat } = goal;

  const caloriesProgress = Math.round((totalCalories / dailyCalories) * 100);
  const proteinProgress = Math.round((totalProtein / dailyProtein) * 100);
  const carbsProgress = Math.round((totalCarbs / dailyCarbs) * 100);
  const fatsProgress = Math.round((totalFats / dailyFat) * 100);

  return {
    caloriesProgress,
    proteinProgress,
    carbsProgress,
    fatsProgress,
  };
};



const logEntry = async (req, res) => {
  try {
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

    // Find all entries for the current date
    const currentDate = new Date().toISOString().split('T')[0];
    const entries = await dailyProgressModel.find({
      createdAt: {
        $gte: new Date(currentDate),
        $lt: new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1))
      }
    });

    // Calculate the total calories, protein, fats, and carbs from all entries
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let allFoods = [];

    entries.forEach((entry) => {
      totalCalories += entry.calories;
      totalProtein += entry.protein;
      totalFats += entry.fats;
      totalCarbs += entry.carbs;
      allFoods.push(...entry.foods);
    });

    res.status(201).json({
      success: "Entry created",
      data: {
        ...saveEntry._doc,
        totalCalories,
        totalProtein,
        totalFats,
        totalCarbs,
        allFoods,
      },
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


const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the entry to delete
    const entryToDelete = await dailyProgressModel.findById(id);

    if (!entryToDelete) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    // Check if the entry is from the current date
    const currentDate = new Date().toISOString().split('T')[0];
    const entryDate = new Date(entryToDelete.createdAt).toISOString().split('T')[0];

    if (entryDate !== currentDate) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete entry from a different date",
      });
    }

    // Delete the entry
    await dailyProgressModel.findByIdAndDelete(id);

    // Find all entries for the current date
    const entries = await dailyProgressModel.find({
      createdAt: {
        $gte: new Date(currentDate),
        $lt: new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)),
      },
    });
    
    // Calculate the total calories, protein, fats, and carbs from all entries
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let allFoods = [];

    entries.forEach((entry) => {
      totalCalories += entry.calories;
      totalProtein += entry.protein;
      totalFats += entry.fats;
      totalCarbs += entry.carbs;
      allFoods.push(...entry.foods);
    });

    res.status(200).json({
      success: true,
      message: "Entry deleted",
      data: {
        totalCalories,
        totalProtein,
        totalFats,
        totalCarbs,
        allFoods,
      },
    });
  } catch (error) {
    console.log("🚀 ~ deleteEntry ~ error:", error);
  }
};


const getTotals = async (req, res) => {
  try {
    const { goalId } = req.params; // get the goal id from the request parameters
    console.log("🚀 ~ getTotals ~ goalId:", goalId)

    // Find all entries for the current date and the specified goal id
    const currentDate = new Date().toISOString().split('T')[0];
    const entries = await dailyProgressModel.find({
      goal: goalId, // filter by goal id
      createdAt: {
        $gte: new Date(currentDate),
        $lt: new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1))
      }
    });
    console.log("🚀 ~ getTotals ~ entries:", entries);

    // Calculate the total calories, protein, fats, and carbs from all entries
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let allFoods = [];

    entries.forEach((entry) => {
      totalCalories += entry.calories;
      totalProtein += entry.protein;
      totalFats += entry.fats;
      totalCarbs += entry.carbs;
      allFoods.push(...entry.foods.map(food => ({ ...food, entryId: entry._id })));
    });

    // Find the goal document
    const goal = await goalModel.findById(req.params.goalId);

    // Calculate the progress
    const progress = calculateProgress({ totalCalories, totalProtein, totalCarbs, totalFats }, goal);

    res.status(200).json({
      success: true,
      data: {
        totalCalories,
        totalProtein,
        totalFats,
        totalCarbs,
        allFoods,
        progress,
      },
    });
  } catch (error) {
    console.log("🚀 ~ getTotals ~ error:", error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving the totals.' });
  }
};


module.exports = {
  logEntry,
  getEntry,
  deleteEntry,
  getEntryInDateRange,
  getTotals
};
