//email handler
const nodemailer = require("nodemailer");
//unique string
const { v4: uuidv4 } = require("uuid");
//env variables access
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL1,
    pass: process.env.AUTH_PASS1,
  },
});

//check if ready for messages
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("ready for messages");
//     console.log(success);
//   }
// });

module.exports = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("error while sending vervication email");
    console.log(error);
  }
};
