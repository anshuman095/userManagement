const upload = require("../middleware/upload");
const { validateUpdateUser } = require("../middleware/validateRequest");
const userService = require("../services/userService");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/message");
const { StatusCodes } = require("http-status-codes");

exports.updateUser = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(ApiError.badRequest(err.message));
    }

    const validationResult = validateUpdateUser(req.body);
    if (validationResult.error) {
      return next(ApiError.badRequest(validationResult.messages[0]));
    }

    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      const { name } = req.body;
      const profile_pic = req.file ? req.file.path : user.profile_pic;

      const updatedData = {
        name: name || user.name,
        profile_pic: profile_pic,
      };

      const updatedUser = await userService.updateUser(id, updatedData);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: Messages.USER_UPDATE_SUCCESS,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  });
};
