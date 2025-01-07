const { StatusCodes } = require("http-status-codes");
const { updateUserStatus } = require("../services/adminService");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/message");
const userService = require("../services/userService");
const { validateStatus } = require("../middleware/validateRequest");

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await userService.getUserById(id);

    const validationResult = validateStatus({ isActive });
    if (validationResult.error) {
      return next(ApiError.badRequest(validationResult.messages[0]));
    }

    const result = await updateUserStatus(user.id, isActive);

    if (result.affectedRows === 0) {
      return next(ApiError.notFound(Messages.USER_NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: Messages.USER_STATUS_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateStatus,
};
