const express = require("express");
const { registerAdmin, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
