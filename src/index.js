const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./../db/connection");
const userRouter = require("./routes/userRoutes");
const goalRouter = require("./routes/goalRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize()); 

// app.get("/", (req, res) => {
//     res.status(200).json({message: "kem cho"});
// });

app.use((req, res, next) => {
    console.log("HTTP METHOD - " + req.method + ", URL - " + req.url);
    next();
})

app.use("/users", userRouter);
app.use("/goals", goalRouter);

app.listen(3001);