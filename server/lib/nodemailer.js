require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_APP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

async function sendMail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_APP_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err);
  }
}

module.exports = { sendMail };
