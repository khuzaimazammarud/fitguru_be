const mongoose = require("mongoose");

const GoalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dailyCalories: {
      type: Number,
      required: true,
    },
    dailyProtein: {
      type: Number,
      required: true,
    },
    dailyFat: {
      type: Number,
      required: true,
    },
    dailyCarbs: {
      type: Number,
      required: true,
    },
    targetWeight: {
      type: Number,
      default: null,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);
