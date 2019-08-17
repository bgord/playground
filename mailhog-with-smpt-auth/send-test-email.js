const nodemailer = require("nodemailer");

const mailConfig = {
  host: "localhost",
  port: 2025, // nginx port
  auth: {
    user: "xyz",
    pass: "xyz"
  }
};

let transporter = nodemailer.createTransport(mailConfig);

const messageConfig = {
  from: "test@example.app",
  to: "xxx@xxx.com",
  subject: "xxx",
  text: "Welcome to xxx"
};

transporter
  .sendMail(messageConfig)
  .then(console.log)
  .catch(console.error);
