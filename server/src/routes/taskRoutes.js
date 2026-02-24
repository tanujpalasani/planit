const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", authorizeRoles("Admin"), createTask);
router.put("/:taskId", authorizeRoles("Admin"), updateTask);
router.patch("/:taskId/status", updateTaskStatus);
router.delete("/:taskId", authorizeRoles("Admin"), deleteTask);

module.exports = router;
