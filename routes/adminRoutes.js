const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { updateUserActiveStatus } = require("../controllers/adminController");

router.patch("/:id", authMiddleware, isAdmin, updateUserActiveStatus);

module.exports = router;
