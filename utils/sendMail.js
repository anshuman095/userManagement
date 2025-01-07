const nodemailer = require("nodemailer");
const ApiError = require("./apiError");
const Messages = require("./message");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_ID,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw ApiError.internal(Messages.EMAIL_FAILED);
  }
};

module.exports = sendEmail;
