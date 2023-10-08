const express = require("express");
const { signup, signin, sendEmail, verifyOtp, updatePassword } = require("../controller/userController");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/sendemail", sendEmail);
userRouter.post("/verifyOtp", verifyOtp);
userRouter.put("/updatePassword/:id", updatePassword);


module.exports = userRouter;