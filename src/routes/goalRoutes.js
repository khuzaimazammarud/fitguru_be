const express = require("express");
const passport = require("passport");
const { createGoal, getGoal } = require("../controller/goalController");

//calling function exported from passport.js
require("../middleware/passport")(passport);

const goalRouter = express.Router();

goalRouter.post("/create", passport.authenticate('jwt', { session: false }), createGoal);
goalRouter.get("/get", passport.authenticate('jwt', { session: false }), getGoal);

module.exports = goalRouter;