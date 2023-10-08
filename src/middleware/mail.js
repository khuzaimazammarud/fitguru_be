"use strick";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "husamiya123@gmail.com",
      pass: "tewr jnya cpdu kzoe",
    },
});

module.exports = transporter;

