const pool = require("../config/db");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/message");

const createRole = async ({ name, description }) => {
  try {
    const [existingRole] = await pool.query(
      "SELECT * FROM role WHERE name = ?",
      [name]
    );
    if (existingRole.length > 0) {
      throw ApiError.badRequest(Messages.ROLE_ALREADY_EXISTS);
    }

    const [result] = await pool.query(
      "INSERT INTO role (name, description) VALUES (?, ?)",
      [name, description]
    );

    const [newRole] = await pool.query("SELECT * FROM role WHERE id = ?", [
      result.insertId,
    ]);
    return newRole[0];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal(Messages.INTERNAL_ERROR);
  }
};

const getRoleById = async (roleId) => {
  try {
    const query = "SELECT * FROM role WHERE id = ?";
    const [rows] = await pool.query(query, [roleId]);

    if (rows.length === 0) {
      throw ApiError.notFound(Messages.ROLE_NOT_FOUND);
    }
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Error fetching role");
  }
};

module.exports = { createRole, getRoleById };
