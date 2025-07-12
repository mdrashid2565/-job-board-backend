// 📁 backend/utils/email.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// ✅ Create reusable transporter using your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail email address
    pass: process.env.EMAIL_PASS, // your Gmail app password
  },
});

/**
 * 📧 Send Email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} text - plain text body
 * @param {string} html - optional HTML body
 */
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"Job Board App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
  }
};

module.exports = sendEmail;
