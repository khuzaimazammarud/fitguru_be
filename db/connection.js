const mongoose = require("mongoose");

const connection = mongoose
    .connect("mongodb+srv://fitguruBE:khuzema123@cluster0.hn1jqzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection to DB established...");
    })
    .catch((error) => {
        console.error("Connection to DB failed...", error.toString());
    });

module.exports = connection;