const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/message");
const { generateToken, generateResetToken } = require("../utils/generateToken");
const { resetPasswordEmail } = require("../templates/emailTemplates");
const sendEmail = require("../utils/sendMail");

const register = async ({ name, email, password, role, profilePic }) => {
  try {
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      throw ApiError.badRequest(Messages.EMAIL_MUST_BE_UNIQUE);
    }

    const [roleData] = await pool.query("SELECT * FROM role WHERE name = ?", [
      role,
    ]);
    if (roleData.length === 0) {
      throw ApiError.badRequest(Messages.ROLE_NOT_FOUND);
    }
    const roleId = roleData[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, profile_pic, role_id) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, profilePic, roleId]
    );

    const [newUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);

    return newUser[0];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal(Messages.USER_ADD_FAILED);
  }
};

const login = async (email, password) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      throw ApiError.notFound(Messages.USER_NOT_FOUND);
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw ApiError.badRequest(Messages.INVALID_CREDENTIALS);
    }

    const token = await generateToken(user);
    return { token, user };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal(Messages.INTERNAL_ERROR);
  }
};

const forgotPassword = async (email, req) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      throw ApiError.notFound(Messages.USER_NOT_FOUND);
    }

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password`;

    const emailContent = resetPasswordEmail(resetUrl);

    await sendEmail({
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal(Messages.INTERNAL_ERROR);
  }
};

const resetPassword = async (email, newPassword, confirmNewPassword) => {
  if (newPassword !== confirmNewPassword) {
    throw ApiError.badRequest(Messages.PASSWORD_MISMATCH);
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0) {
    throw ApiError.notFound(Messages.USER_NOT_FOUND);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query("UPDATE users SET password = ? WHERE email = ?", [
    hashedPassword,
    email,
  ]);
};

module.exports = { register, login, forgotPassword, resetPassword };
