const Messages = require("../utils/message");

const resetPasswordEmail = (resetUrl) => {
  return {
    subject: Messages.RESET_PASSWORD_SUBJECT,
    text: `${Messages.RESET_PASSWORD_TEXT} ${resetUrl}`,
    html: `<p>${Messages.RESET_PASSWORD_TEXT} <a href="${resetUrl}">${resetUrl}</a></p>`
  };
};

module.exports = { resetPasswordEmail };