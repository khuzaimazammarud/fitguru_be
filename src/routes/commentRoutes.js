const express = require("express");
const passport = require("passport");
const { createComment, getComment } = require("../controller/commentController");

//calling function exported from passport.js
require("../middleware/passport")(passport);

const commentRouter = express.Router();

commentRouter.post("/create", passport.authenticate('jwt', { session: false }), createComment);
commentRouter.get("/:id", passport.authenticate('jwt', { session: false }), getComment);


module.exports = commentRouter;