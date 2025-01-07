const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { updateStatus } = require("../controllers/adminController");

router.patch("/:id", authMiddleware, isAdmin, updateStatus);

module.exports = router;
