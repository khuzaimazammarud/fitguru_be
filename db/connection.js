const mongoose = require("mongoose");

const connection = mongoose
    .connect("mongodb://0.0.0.0:27017/fitguru", {
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection to DB established...");
    })
    .catch((error) => {
        console.error("Connection to DB failed...", error.toString());
    });

module.exports = connection;