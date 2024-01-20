const express = require("express");
const passport = require("passport");
const {getFood} = require("../controller/foodController")

//calling function exported from passport.js
require("../middleware/passport")(passport);

const foodRouter = express.Router();

// foodRouter.post("/create", passport.authenticate('jwt', { session: false }), createGoal);
foodRouter.get("/:query", getFood);

module.exports = foodRouter;