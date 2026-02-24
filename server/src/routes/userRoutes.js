const express = require("express");
const { getUsers, createMember, deleteMember } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware, authorizeRoles("Admin"));

router.get("/", getUsers);
router.post("/", createMember);
router.delete("/:userId", deleteMember);

module.exports = router;
