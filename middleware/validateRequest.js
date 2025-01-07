const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.pattern.base":
        "Name must only contain alphabetic characters",
      "any.required": "Name is required",
    }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(5).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 5 characters long",
    "any.required": "Password is required",
  }),
  profile_pic: Joi.alternatives()
    .try(
      Joi.string().required(),
      Joi.object()
        .keys({
          fieldname: Joi.string().valid("profile_pic").required(),
          originalname: Joi.string().required(),
          encoding: Joi.string().required(),
          mimetype: Joi.string().valid("image/jpeg", "image/png").required(),
          destination: Joi.string().required(),
          filename: Joi.string().required(),
          path: Joi.string().required(),
          size: Joi.number().required(),
        })
        .required()
    )
    .messages({
      "any.required": "Profile pic is required",
    }),
  role: Joi.string().optional().messages({
    "string.base": "Role must be a string",
    "any.only": "Role must be either 'user' or 'admin'",
    "any.required": "Role is required",
  }),
}).strict();
const validateWithUnknownCheck = (schema, data) => {
  const { error } = schema.validate(data, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    const errorDetails = error.details.map((detail) => {
      if (detail.type === "object.unknown") {
        return `The field ${detail.context.key} is not allowed in the request`;
      }
      return detail.message;
    });

    return {
      error: true,
      messages: errorDetails,
    };
  }
  return { error: false };
};
const validateUser = (data) => validateWithUnknownCheck(userSchema, data);

const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
  }),
  profile_pic: Joi.string().optional().messages({
    "string.base": "Profile pic must be a string",
  }),
})
  .strict()
  .unknown(false);

const validateUpdateUser = (data) =>
  validateWithUnknownCheck(updateUserSchema, data);

const roleSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    "string.base": "Role name must be a string",
    "string.empty": "Role name cannot be empty",
    "any.required": "Role name is required",
  }),
  description: Joi.string().max(255).optional().messages({
    "string.base": "Description must be a string",
  }),
});

const validateRole = (data) => {
  return roleSchema.validate(data, { abortEarly: false, convert: false });
};

const statusSchema = Joi.object({
  isActive: Joi.string().valid("active", "inactive").required().messages({
    "any.required": "Status is required",
    "any.only": "Status must be either 'active' or 'inactive'",
  }),
}).strict();
const validateStatus = (data) => validateWithUnknownCheck(statusSchema, data);

module.exports = {
  validateUser,
  validateUpdateUser,
  validateRole,
  validateStatus,
};
