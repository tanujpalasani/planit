const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAdminScopeId = (reqUser) => (reqUser.role === "Admin" ? reqUser.userId : reqUser.adminId);
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const normalizeObjectIdList = (values) => (
  Array.isArray(values) ? values.filter((value) => isValidObjectId(value)) : []
);

const getProjects = async (req, res, next) => {
  try {
    const adminId = getAdminScopeId(req.user);
    const query = { adminId };

    if (req.user.role === "Member") {
      query.memberIds = req.user.userId;
    }

    const projects = await Project.find(query)
      .populate("memberIds", "name email role")
      .sort({ createdAt: -1 });
    return res.status(200).json({ projects });
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description = "", memberIds = [] } = req.body;
    const normalizedTitle = String(title || "").trim();

    if (!normalizedTitle) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const adminId = getAdminScopeId(req.user);
    const validInputMemberIds = normalizeObjectIdList(memberIds);
    const validMemberIds = await User.find({
      _id: { $in: validInputMemberIds },
      role: "Member",
      adminId,
    }).distinct("_id");

    const project = await Project.create({
      title: normalizedTitle,
      description: String(description || "").trim(),
      memberIds: validMemberIds,
      adminId,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, memberIds } = req.body;
    const adminId = getAdminScopeId(req.user);
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findOne({ _id: projectId, adminId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (typeof title === "string" && title.trim()) {
      project.title = title.trim();
    }
    if (typeof description === "string") {
      project.description = description.trim();
    }
    if (Array.isArray(memberIds)) {
      const previousMemberIds = Array.isArray(project.memberIds)
        ? project.memberIds.map((memberId) => String(memberId))
        : [];
      const validInputMemberIds = normalizeObjectIdList(memberIds);
      const validMemberIds = await User.find({
        _id: { $in: validInputMemberIds },
        role: "Member",
        adminId,
      }).distinct("_id");
      project.memberIds = validMemberIds;
      const nextMemberKeys = new Set(validMemberIds.map((memberId) => String(memberId)));
      const removedMemberIds = previousMemberIds.filter((memberId) => !nextMemberKeys.has(memberId));
      if (removedMemberIds.length > 0) {
        await Task.updateMany(
          { adminId, projectId: project._id, assigneeId: { $in: removedMemberIds } },
          { $set: { assigneeId: null } }
        );
        await Task.updateMany(
          { adminId, projectId: project._id, "subtasks.assigneeId": { $in: removedMemberIds } },
          { $set: { "subtasks.$[subtask].assigneeId": null } },
          { arrayFilters: [{ "subtask.assigneeId": { $in: removedMemberIds } }] }
        );
      }
    }

    await project.save();

    return res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const adminId = getAdminScopeId(req.user);
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findOneAndDelete({ _id: projectId, adminId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Task.deleteMany({ projectId: project._id, adminId });

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
