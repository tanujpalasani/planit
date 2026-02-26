const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAdminScopeId = (reqUser) => (reqUser.role === "Admin" ? reqUser.userId : reqUser.adminId);

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const VALID_TASK_STATUSES = new Set(["Todo", "In Progress", "Completed"]);
const VALID_TASK_PRIORITIES = new Set(["Low", "Medium", "High"]);

const normalizeNullableDate = (value) => {
  if (value === undefined) {
    return { hasValue: false, date: undefined };
  }
  if (value === null || value === "") {
    return { hasValue: true, date: null };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { hasValue: true, invalid: true };
  }

  return { hasValue: true, date: parsed };
};

const isAssigneeAllowedInProject = (assigneeId, adminId, project) => {
  if (!assigneeId) {
    return true;
  }

  const assigneeKey = String(assigneeId);
  const memberKeys = new Set((project?.memberIds || []).map((memberId) => String(memberId)));
  return memberKeys.has(assigneeKey);
};

const resolveAssignableUserId = async (assigneeId, adminId, allowedMemberIds = null) => {
  if (assigneeId === null || assigneeId === undefined || assigneeId === "") {
    return null;
  }
  if (!isValidObjectId(assigneeId)) {
    return null;
  }

  const user = await User.findOne({
    _id: assigneeId,
    role: "Member",
    adminId,
  }).select("_id");

  if (!user) {
    return null;
  }

  if (Array.isArray(allowedMemberIds)) {
    const allowedKeys = new Set(allowedMemberIds.map((memberId) => String(memberId)));
    if (!allowedKeys.has(String(user._id))) {
      return null;
    }
  }

  return user._id;
};

const sanitizeSubtasks = async (subtasks, adminId, project) => {
  if (!Array.isArray(subtasks)) {
    return [];
  }

  const normalized = [];

  for (const subtask of subtasks) {
    if (!subtask || typeof subtask !== "object") {
      continue;
    }

    const title = String(subtask.title || "").trim();
    if (!title) {
      continue;
    }

    const rawId = subtask._id || subtask.id;
    const validObjectId = rawId && isValidObjectId(rawId) ? rawId : undefined;
    const assignee = await resolveAssignableUserId(subtask.assigneeId, adminId, project?.memberIds || []);
    const normalizedDate = normalizeNullableDate(subtask.dueDate);

    if (subtask.assigneeId && !assignee) {
      throw new Error("Invalid subtask assigneeId");
    }
    if (normalizedDate.invalid) {
      throw new Error("Invalid subtask dueDate");
    }

    normalized.push({
      ...(validObjectId ? { _id: validObjectId } : {}),
      title,
      completed: Boolean(subtask.completed),
      dueDate: normalizedDate.hasValue ? normalizedDate.date : null,
      assigneeId: assignee || null,
    });
  }

  return normalized;
};

const getTasks = async (req, res, next) => {
  try {
    const adminId = getAdminScopeId(req.user);
    const query = { adminId };

    if (req.user.role === "Member") {
      query.$or = [
        { assigneeId: req.user.userId },
        { "subtasks.assigneeId": req.user.userId },
      ];
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

    const normalizedTitle = String(title || "").trim();
    if (!normalizedTitle || !projectId) {
      return res.status(400).json({ message: "Task title and projectId are required" });
    }
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!VALID_TASK_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (!VALID_TASK_PRIORITIES.has(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const normalizedTaskDueDate = normalizeNullableDate(dueDate);
    if (normalizedTaskDueDate.invalid) {
      return res.status(400).json({ message: "Invalid dueDate" });
    }

    const project = await Project.findOne({ _id: projectId, adminId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const normalizedAssigneeId = await resolveAssignableUserId(assigneeId, adminId, project.memberIds);
    if (assigneeId && !normalizedAssigneeId) {
      return res.status(400).json({ message: "Invalid assigneeId" });
    }

    let sanitizedSubtasks = [];
    try {
      sanitizedSubtasks = await sanitizeSubtasks(subtasks, adminId, project);
    } catch {
      return res.status(400).json({ message: "Invalid subtask values" });
    }

    const task = await Task.create({
      title: normalizedTitle,
      description: String(description || "").trim(),
      projectId,
      assigneeId: normalizedAssigneeId,
      status,
      priority,
      dueDate: normalizedTaskDueDate.hasValue ? normalizedTaskDueDate.date : null,
      subtasks: sanitizedSubtasks,
      adminId,
      createdBy: req.user.userId,
      completedAt: status === "Completed" ? new Date() : null,
    });
    if (task.assigneeId) {
      task.subtasks = (task.subtasks || []).map((subtask) => ({
        ...subtask.toObject(),
        assigneeId: task.assigneeId,
      }));
      await task.save();
    }

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
    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

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
    let effectiveProject = await Project.findOne({ _id: task.projectId, adminId }).select("_id memberIds");
    if (!effectiveProject) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    if (typeof title === "string") {
      const normalizedTitle = title.trim();
      if (!normalizedTitle) {
        return res.status(400).json({ message: "Task title is required" });
      }
      task.title = normalizedTitle;
    }
    if (typeof description === "string") {
      task.description = description.trim();
    }
    if (projectId !== undefined) {
      if (!isValidObjectId(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
      }
      const project = await Project.findOne({ _id: projectId, adminId });
      if (!project) {
        return res.status(400).json({ message: "Invalid projectId" });
      }
      task.projectId = project._id;
      effectiveProject = project;
    }
    if (assigneeId !== undefined) {
      if (assigneeId === null || assigneeId === "") {
        task.assigneeId = null;
      } else {
        const normalizedAssigneeId = await resolveAssignableUserId(assigneeId, adminId, effectiveProject.memberIds);
        if (!normalizedAssigneeId) {
          return res.status(400).json({ message: "Invalid assigneeId" });
        }
        task.assigneeId = normalizedAssigneeId;
      }
    }
    if (status !== undefined) {
      if (!VALID_TASK_STATUSES.has(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      task.status = status;
      task.completedAt = status === "Completed" ? new Date() : null;
    }
    if (priority !== undefined) {
      if (!VALID_TASK_PRIORITIES.has(priority)) {
        return res.status(400).json({ message: "Invalid priority" });
      }
      task.priority = priority;
    }
    if (dueDate !== undefined) {
      const normalizedTaskDueDate = normalizeNullableDate(dueDate);
      if (normalizedTaskDueDate.invalid) {
        return res.status(400).json({ message: "Invalid dueDate" });
      }
      task.dueDate = normalizedTaskDueDate.date;
    }
    if (Array.isArray(subtasks)) {
      try {
        task.subtasks = await sanitizeSubtasks(subtasks, adminId, effectiveProject);
      } catch {
        return res.status(400).json({ message: "Invalid subtask values" });
      }
    }
    if (!isAssigneeAllowedInProject(task.assigneeId, adminId, effectiveProject)) {
      return res.status(400).json({ message: "Task assignee must be in the selected project" });
    }
    for (const subtask of task.subtasks || []) {
      if (!isAssigneeAllowedInProject(subtask.assigneeId, adminId, effectiveProject)) {
        return res.status(400).json({ message: "Subtask assignee must be in the selected project" });
      }
    }
    if (task.assigneeId) {
      task.subtasks = (task.subtasks || []).map((subtask) => ({
        ...subtask.toObject(),
        assigneeId: task.assigneeId,
      }));
    } else {
      task.subtasks = (task.subtasks || []).map((subtask) => ({
        ...subtask.toObject(),
        assigneeId: null,
      }));
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

const updateSubtask = async (req, res, next) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { title, completed, dueDate, assigneeId } = req.body;
    const adminId = getAdminScopeId(req.user);
    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const query = { _id: taskId, adminId };

    const task = await Task.findOne(query);
    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    if (!isValidObjectId(subtaskId)) {
      return res.status(400).json({ message: "Invalid subtaskId" });
    }

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    if (req.user.role === "Member") {
      const keys = Object.keys(req.body || {});
      const canOnlyUpdateCompleted = keys.length > 0 && keys.every((key) => key === "completed");
      if (!canOnlyUpdateCompleted) {
        return res.status(403).json({ message: "Members can only update subtask completion" });
      }
      if (String(subtask.assigneeId || "") !== String(req.user.userId)) {
        return res.status(403).json({ message: "Members can only update assigned subtasks" });
      }
      subtask.completed = Boolean(completed);
    } else {
      const project = await Project.findOne({ _id: task.projectId, adminId }).select("_id memberIds");
      if (!project) {
        return res.status(400).json({ message: "Invalid projectId" });
      }

      if (typeof title === "string" && title.trim()) {
        subtask.title = title.trim();
      }
      if (completed !== undefined) {
        subtask.completed = Boolean(completed);
      }
      if (dueDate !== undefined) {
        const normalizedSubtaskDueDate = normalizeNullableDate(dueDate);
        if (normalizedSubtaskDueDate.invalid) {
          return res.status(400).json({ message: "Invalid subtask dueDate" });
        }
        subtask.dueDate = normalizedSubtaskDueDate.date;
      }
      if (assigneeId !== undefined) {
        // Subtask assignee mirrors task assignee for consistency in project task ownership.
        subtask.assigneeId = task.assigneeId || null;
      }
    }

    await task.save();

    return res.status(200).json({
      message: "Subtask updated successfully",
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
    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (!VALID_TASK_STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid status" });
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
    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

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
  updateSubtask,
  deleteTask,
};
