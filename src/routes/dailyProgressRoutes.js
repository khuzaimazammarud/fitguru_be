const express = require("express");
const passport = require("passport");
const { logEntry, getEntryInDateRange, deleteEntry, getTotals } = require("../controller/dailyProgress.controller");

//calling function exported from passport.js
require("../middleware/passport")(passport);

const dailyPorgressRoute = express.Router();

dailyPorgressRoute.post("", passport.authenticate('jwt', { session: false }), logEntry);
dailyPorgressRoute.get("", passport.authenticate('jwt', { session: false }), getEntryInDateRange);
dailyPorgressRoute.delete("/:id", passport.authenticate('jwt', { session: false }), deleteEntry);
dailyPorgressRoute.get("/total/:goalId", passport.authenticate('jwt', { session: false }), getTotals);

module.exports = dailyPorgressRoute;