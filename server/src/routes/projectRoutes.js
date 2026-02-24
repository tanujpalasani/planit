const express = require("express");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProjects);
router.post("/", authorizeRoles("Admin"), createProject);
router.put("/:projectId", authorizeRoles("Admin"), updateProject);
router.delete("/:projectId", authorizeRoles("Admin"), deleteProject);

module.exports = router;
