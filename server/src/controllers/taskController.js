const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const getAdminScopeId = (reqUser) => (reqUser.role === "Admin" ? reqUser.userId : reqUser.adminId);

const sanitizeSubtasks = (subtasks) => {
  if (!Array.isArray(subtasks)) {
    return [];
  }

  return subtasks
    .filter((subtask) => subtask && typeof subtask === "object")
    .map((subtask) => ({
      title: String(subtask.title || "").trim(),
      completed: Boolean(subtask.completed),
      dueDate: subtask.dueDate || null,
      assigneeId: subtask.assigneeId || null,
    }))
    .filter((subtask) => subtask.title);
};

const getTasks = async (req, res, next) => {
  try {
    const adminId = getAdminScopeId(req.user);
    const query = { adminId };

    if (req.user.role === "Member") {
      query.assigneeId = req.user.userId;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const adminId = getAdminScopeId(req.user);
    const {
      title,
      description = "",
      projectId,
      assigneeId = null,
      status = "Todo",
      priority = "Medium",
      dueDate = null,
      subtasks = [],
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Task title and projectId are required" });
    }

    const project = await Project.findOne({ _id: projectId, adminId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let normalizedAssigneeId = null;
    if (assigneeId) {
      const assignee = await User.findOne({
        _id: assigneeId,
        adminId,
      });
      if (!assignee) {
        return res.status(400).json({ message: "Invalid assigneeId" });
      }
      normalizedAssigneeId = assignee._id;
    }

    const task = await Task.create({
      title: String(title).trim(),
      description: String(description || "").trim(),
      projectId,
      assigneeId: normalizedAssigneeId,
      status,
      priority,
      dueDate,
      subtasks: sanitizeSubtasks(subtasks),
      adminId,
      createdBy: req.user.userId,
      completedAt: status === "Completed" ? new Date() : null,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const adminId = getAdminScopeId(req.user);
    const task = await Task.findOne({ _id: taskId, adminId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      projectId,
      assigneeId,
      status,
      priority,
      dueDate,
      subtasks,
    } = req.body;

    if (typeof title === "string" && title.trim()) {
      task.title = title.trim();
    }
    if (typeof description === "string") {
      task.description = description.trim();
    }
    if (projectId) {
      const project = await Project.findOne({ _id: projectId, adminId });
      if (!project) {
        return res.status(400).json({ message: "Invalid projectId" });
      }
      task.projectId = project._id;
    }
    if (assigneeId !== undefined) {
      if (assigneeId === null || assigneeId === "") {
        task.assigneeId = null;
      } else {
        const assignee = await User.findOne({ _id: assigneeId, adminId });
        if (!assignee) {
          return res.status(400).json({ message: "Invalid assigneeId" });
        }
        task.assigneeId = assignee._id;
      }
    }
    if (status) {
      task.status = status;
      task.completedAt = status === "Completed" ? new Date() : null;
    }
    if (priority) {
      task.priority = priority;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }
    if (Array.isArray(subtasks)) {
      task.subtasks = sanitizeSubtasks(subtasks);
    }

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const adminId = getAdminScopeId(req.user);

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const query = { _id: taskId, adminId };
    if (req.user.role === "Member") {
      query.assigneeId = req.user.userId;
    }

    const task = await Task.findOne(query);
    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    task.status = status;
    task.completedAt = status === "Completed" ? new Date() : null;
    await task.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const adminId = getAdminScopeId(req.user);

    const task = await Task.findOneAndDelete({ _id: taskId, adminId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
