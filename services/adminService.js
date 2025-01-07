const pool = require("../config/db");
const ApiError = require("../utils/apiError");

const updateUserStatus = async (userId, status) => {
  const query = "UPDATE users SET isActive = ? WHERE id = ?";
  const values = [status, userId];
  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    throw ApiError.internal(Messages.INTERNAL_ERROR);
  }
};

module.exports = {
  updateUserStatus,
};
