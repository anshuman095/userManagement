const roleService = require("../services/roleService");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/message");
const { validateRole } = require("../middleware/validateRequest");

exports.createRole = async (req, res, next) => {
  const { error } = validateRole(req.body);
  if (error) {
    return next(ApiError.badRequest(error.details[0].message));
  }

  const { name, description } = req.body;

  try {
    const role = await roleService.createRole({ name, description });
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: Messages.ROLE_CREATED_SUCCESS,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};
