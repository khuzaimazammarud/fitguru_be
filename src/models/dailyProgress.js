const mongoose = require("mongoose");

const DailyProgressSchema = mongoose.Schema(
  {
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    // breakfast, lunch, dinner
    timeOfDay: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    fats: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DailyProgressSchema.virtual("date").get(function () {
  return `${this.createdAt.getFullYear()}-${this.createdAt.getMonth() + 1}-${this.createdAt.getDate()}`;
});

module.exports = mongoose.model("DailyProgress", DailyProgressSchema);
