"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const goalModel = require("../models/goal");
const forgotpasswordModel = require("../models/forgotpassword");
const ObjectId = require("mongoose").Types.ObjectId;

const transporter = require("../middleware/mail");

const SECRET_KEY = "FITGURUAPI";

function calculateBMR(user) {
  const weight = user.weight;
  const height = user.height * 30.48; //convert to centimeters
  const age = user.age;
  return user.gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

function calculateTDEE(bmr, activityFactor) {
  return bmr * activityFactor;
}

function determineGoal(currentWeight, targetWeight) {
  if (currentWeight === targetWeight) return "maintain";
  if (currentWeight < targetWeight) return "gainWeight";
  return "loseWeight";
}

function calculateMacros(tdee, goal) {
  let proteinRatio = 0.3;
  let fatRatio = 0.3;
  let carbRatio = 0.4;

  if (goal === "loseWeight") {
    proteinRatio = 0.4;
    fatRatio = 0.3;
    carbRatio = 0.3;
  } else if (goal === "gainWeight") {
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbRatio = 0.4;
  }

  const dailyProtein = Math.round(tdee * proteinRatio / 4);
  const dailyFat = Math.round(tdee * fatRatio / 9);
  const dailyCarbs = Math.round(tdee * carbRatio / 4);

  return { dailyProtein, dailyFat, dailyCarbs };
}
const signup = async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    gender,
    age,
    weight,
    height,
  } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password doesnot matches" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      email,
      password: hashedPassword,
      username,
      gender,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
    });

    const bmr = calculateBMR(result);
    const activityLevel = req.body.activityLevel || "sedentary"; // Default to sedentary
    let activityFactor = 1.2; // Sedentary
    if (activityLevel === "lightlyActive") activityFactor = 1.375;
    else if (activityLevel === "moderatelyActive") activityFactor = 1.55;
    else if (activityLevel === "veryActive") activityFactor = 1.725;
    else if (activityLevel === "extremelyActive") activityFactor = 1.9;

    const tdee = calculateTDEE(bmr, activityFactor);
    const goal = determineGoal(result.weight, req.body.targetWeight);

    let calorieDeficit = 0;
    let calorieSurplus = 0;
    if (goal === "loseWeight") calorieDeficit = 500;
    else if (goal === "gainWeight") calorieSurplus = 500;

    const adjustedCalories =
      goal === "maintain"
        ? tdee
        : tdee + (goal === "loseWeight" ? -calorieDeficit : calorieSurplus);

    const { dailyProtein, dailyFat, dailyCarbs } = calculateMacros(adjustedCalories, goal);

    const newGoal = new goalModel({
      user: result._id,
      dailyCalories: Math.round(adjustedCalories),
      dailyProtein,
      dailyFat,
      dailyCarbs,
      targetWeight: req.body.targetWeight,
    });
    await newGoal.save();

    const token = jwt.sign(
      { email: result.email, id: result._id, name: result.username },
      SECRET_KEY
    );
    res
      .status(201)
      .json({
        user: result,
        goal: newGoal,
        token,
        message: "Account is Created",
      });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "invalid username or passowrd" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(404).json({ message: "invalid username or passowrd" });
    }

    // Find the goal associated with the user
    const goal = await goalModel.findOne({ user: existingUser._id });
    const goalId = goal ? goal._id : null;

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        name: existingUser.username,
        goalId,
      },
      SECRET_KEY
    );

    res
      .status(200)
      .json({ user: existingUser, token, message: "Login successfull" });
  } catch (error) {
    console.log("🚀 ~ file: userController.js:47 ~ signin ~ error:", error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const sendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });

    if (!existingUser) {
      throw "No user found with this email Do you have an Account?";
    }

    const existingOtp = await forgotpasswordModel.findOne({
      userId: existingUser._id,
    });

    if (existingOtp) {
      await forgotpasswordModel.deleteMany({ userId: existingOtp.userId });
    }

    const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    //send mail to user
    const info = await transporter.sendMail({
      from: "husamiya123@gmail.com",
      to: email,
      subject: "Reset Password",
      text: "Your Otp for Fitgutu",
      html: `Your otp is <b>${otp}</b> enter in fitguru`,
    });

    const newOtp = new forgotpasswordModel({
      userId: existingUser._id,
      otp: hashedOtp,
    });
    const saveOtp = await newOtp.save();

    if (!saveOtp) {
      throw "somthing went wrong";
    }

    res
      .status(200)
      .json({ message: "Otp send check your Email", details: saveOtp });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;
  console.log(
    "🚀 ~ file: userController.js:116 ~ verifyOtp ~ req.body:",
    req.body
  );
  try {
    const existingOtp = await forgotpasswordModel.findOne({ userId: userId });

    if (!existingOtp) {
      throw "No record Found";
    }

    const matchOtp = await bcrypt.compare(otp, existingOtp.otp);

    if (!matchOtp) {
      throw "Wrong Otp";
    }
    res.status(200).json({ message: "Verified" });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const updatePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  console.log(
    "🚀 ~ file: userController.js:138 ~ updatePassword ~ req.body:",
    req.body
  );
  try {
    const existingUser = await userModel.findById({ _id: req.params.id });

    if (!existingUser) {
      throw "No User found";
    }

    if (password !== confirmPassword) {
      throw "Password Does Matches";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateUser = await userModel.updateOne(
      { _id: req.params.id },
      { password: hashedPassword }
    );

    if (updateUser) {
      res.status(200).json({ message: "Password changed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

module.exports = {
  signup,
  signin,
  sendEmail,
  verifyOtp,
  updatePassword,
};
