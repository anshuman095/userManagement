const Messages = {
  ROLE_CREATED_SUCCESS: "Role created successfully",
  ROLE_ALREADY_EXISTS: "Role already exists",
  EMAIL_MUST_BE_UNIQUE: "Email must be unique",
  USER_NOT_FOUND: "User not found",
  ROLE_NOT_FOUND: "The specified role does not exist",
  USER_ADD_SUCCESS: "User created successfully",
  USER_ADD_FAILED: "Failed to create user",
  USER_UPDATE_SUCCESS: "User updated successfully",
  USER_UPDATE_FAILED: "Failed to update user",
  INTERNAL_ERROR: "Internal Server Error",
  DATA_SUCCESS: "Data retrieved successfully",
  LOGIN_SUCCESS: "Login successfully",
  INVALID_CREDENTIALS: "Invalid credentials",
  EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required",

  EMAIL_REQUIRED: "Email is required",
  EMAIL_FAILED: "Failed to send email",
  PASSWORD_RESET_EMAIL_SENT: "Password reset email sent successfully",
  RESET_PASSWORD_SUBJECT: "Reset Your Password",
  RESET_PASSWORD_TEXT: "Click the link below to reset your password:",
  PASSWORD_MISMATCH: "New password and confirm password do not match",
  PASSWORDS_REQUIRED: "New password and confirm password are required",
  PASSWORD_UPDATE_SUCCESS: "Password updated successfully",
  RESET_TOKEN_EXPIRED: "Reset token has expired",

  TOKEN_EXPIRED: "Token expired",
  NO_TOKEN_PROVIDED: "There is no token attached to the header",
  NOT_ADMIN: "You are not authorized to access this resource",

  USER_STATUS_UPDATED: "User status updated successfully",

  URL_NOT_FOUND: "Url not found",
};

module.exports = Messages;
