require('dotenv').config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./../db/connection");

const userRouter = require("./routes/userRoutes");
const goalRouter = require("./routes/goalRoutes");
const foodRouter = require("./routes/foodRoutes");
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize()); 

app.use((req, res, next) => {
    console.log("HTTP METHOD - " + req.method + ", URL - " + req.url);
    next();
})

app.use("/users", userRouter);
app.use("/goals", goalRouter);
app.use("/food", foodRouter);
app.use("/posts", postRouter);
app.use("/comment", commentRouter);

app.listen(3001);