const pool = require("../config/db");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/message");

const getUserById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw ApiError.notFound(Messages.USER_NOT_FOUND);
    }
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal(Messages.INTERNAL_ERROR);
  }
};

const updateUser = async (id, updatedData) => {
  try {
    const { name, profile_pic } = updatedData;

    const [result] = await pool.query(
      "UPDATE users SET name = ?, profile_pic = ?, updatedAt = NOW() WHERE id = ?",
      [name, profile_pic, id]
    );

    if (result.affectedRows === 0) {
      throw ApiError.notFound(Messages.USER_NOT_FOUND);
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw ApiError.notFound(Messages.USER_NOT_FOUND);
    }

    return rows[0];
  } catch (error) {
    throw ApiError.internal(Messages.INTERNAL_ERROR);
  }
};

module.exports = { getUserById, updateUser };
