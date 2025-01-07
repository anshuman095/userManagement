const upload = require("../middleware/upload");
const { validateUser } = require("../middleware/validateRequest");
const authService = require("../services/authService");
const ApiError = require("../utils/apiError");
const Messages = require("../utils/message");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");

exports.register = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(ApiError.badRequest(err));
    }

    if (req.file === undefined) {
      return next(ApiError.badRequest("Profile picture is required"));
    }

    if (req.body.email) {
      req.body.email = req.body.email.trim();
    }

    const validationResult = validateUser(req.body);
    if (validationResult.error) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      });
      return next(ApiError.badRequest(validationResult.messages[0]));
    }

    const { name, email, password, role = "user" } = req.body;
    let profilePicPath = req.file.path;

    try {
      const userId = await authService.register({
        name,
        email,
        password,
        role,
        profilePic: profilePicPath,
      });

      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: Messages.USER_ADD_SUCCESS,
        data: userId,
      });
    } catch (error) {
      fs.unlink(profilePicPath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      });
      next(error);
    }
  });
};

exports.login = async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return next(ApiError.badRequest(Messages.EMAIL_AND_PASSWORD_REQUIRED));
  }

  email = email.trim();

  try {
    const { token } = await authService.login(email, password);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: Messages.LOGIN_SUCCESS,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(ApiError.badRequest(Messages.EMAIL_REQUIRED));
  }

  try {
    await authService.forgotPassword(email, req);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: Messages.PASSWORD_RESET_EMAIL_SENT,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { newPassword, confirmNewPassword, email } = req.body;

  if (!newPassword || !confirmNewPassword) {
    return next(ApiError.badRequest(Messages.PASSWORDS_REQUIRED));
  }

  try {
    await authService.resetPassword(email, newPassword, confirmNewPassword);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: Messages.PASSWORD_UPDATE_SUCCESS,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(ApiError.badRequest(Messages.RESET_TOKEN_EXPIRED));
    }
    next(error);
  }
};
