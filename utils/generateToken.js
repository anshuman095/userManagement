const jwt = require("jsonwebtoken");

const generateToken = async (data) => {
  const payload = {
    id: data.id,
    role: data.role,
    email: data.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const generateResetToken = async (data) => {
  const payload = {
    email: data.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

module.exports = { generateToken, generateResetToken };
