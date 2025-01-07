const jwt = require("jsonwebtoken");
const { getUserById } = require("../services/userService");
const Messages = require("../utils/message");
const ApiError = require("../utils/apiError");
const { getRoleById } = require("../services/roleService");

const authMiddleware = async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.id);
        req.user = user;
        next();
      }
    } catch (err) {
      return next(ApiError.unauthorized(Messages.TOKEN_EXPIRED));
    }
  } else {
    return next(ApiError.unauthorized(Messages.NO_TOKEN_PROVIDED));
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const role = await getRoleById(req.user.role_id);

    if (role && role.name === "admin") {
      return next();
    }

    return next(ApiError.forbidden(Messages.NOT_ADMIN));
  } catch (error) {
    return next(ApiError.internalServerError("Internal server error"));
  }
};

module.exports = { authMiddleware, isAdmin };
