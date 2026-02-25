const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const mongoose = require("mongoose");

const getAdminScopeId = (reqUser) => (reqUser.role === "Admin" ? reqUser.userId : reqUser.adminId);
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const getUsers = async (req, res, next) => {
  try {
    const adminId = getAdminScopeId(req.user);

    const members = await User.find({
      role: "Member",
      adminId,
    }).select("-password");

    return res.status(200).json({ users: members });
  } catch (error) {
    return next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const adminId = getAdminScopeId(req.user);
    const member = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: "Member",
      adminId,
    });

    return res.status(201).json({
      message: "Member created successfully",
      user: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        adminId: member.adminId,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const adminId = getAdminScopeId(req.user);
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const member = await User.findOne({
      _id: userId,
      role: "Member",
      adminId,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await User.deleteOne({ _id: member._id });
    await Project.updateMany(
      { adminId },
      { $pull: { memberIds: member._id } }
    );
    await Task.updateMany(
      { adminId, assigneeId: member._id },
      { $set: { assigneeId: null } }
    );
    await Task.updateMany(
      { adminId, "subtasks.assigneeId": member._id },
      {
        $set: {
          "subtasks.$[subtask].assigneeId": null,
        },
      },
      {
        arrayFilters: [{ "subtask.assigneeId": member._id }],
      }
    );

    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  createMember,
  deleteMember,
};
