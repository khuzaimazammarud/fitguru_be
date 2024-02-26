const express = require("express");
const passport = require("passport");
const { createPost, getPost, editPost, deletePost, getPostByID, getPostByFollowing } = require("../controller/postController");

//calling function exported from passport.js
require("../middleware/passport")(passport);

const postRouter = express.Router();

postRouter.post("/create", passport.authenticate('jwt', { session: false }), createPost);
postRouter.put("/edit/:id", passport.authenticate('jwt', { session: false }), editPost);
postRouter.delete("/delete/:id", passport.authenticate('jwt', { session: false }), deletePost);
postRouter.get("/", passport.authenticate('jwt', { session: false }), getPost);
postRouter.get("/:id", passport.authenticate('jwt', { session: false }), getPostByID);
postRouter.get("/follower/:userId", passport.authenticate('jwt', { session: false }), getPostByFollowing);

module.exports = postRouter;