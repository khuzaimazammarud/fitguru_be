const express = require("express");
const passport = require("passport");
const { logEntry, getEntryInDateRange } = require("../controller/dailyProgress.controller");

//calling function exported from passport.js
require("../middleware/passport")(passport);

const dailyPorgressRoute = express.Router();

dailyPorgressRoute.post("", passport.authenticate('jwt', { session: false }), logEntry);
dailyPorgressRoute.get("", passport.authenticate('jwt', { session: false }), getEntryInDateRange);

module.exports = dailyPorgressRoute;