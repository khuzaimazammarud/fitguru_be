const express = require("express");
const passport = require("passport");
const { createGoal, getGoalByUserId } = require("../controller/goalController");

//calling function exported from passport.js
require("../middleware/passport")(passport);

const goalRouter = express.Router();

goalRouter.post("/create", passport.authenticate('jwt', { session: false }), createGoal);
goalRouter.get("/user/:id", passport.authenticate('jwt', { session: false }), getGoalByUserId);

module.exports = goalRouter;