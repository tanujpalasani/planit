const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const generateToken = require("../utils/generateToken");

const buildSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  adminId: user.adminId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerAdmin = async (req, res, next) => {
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

    const admin = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: "Admin",
      adminId: null,
    });

    const token = generateToken(admin);

    return res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: buildSafeUser(admin),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: buildSafeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: buildSafeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body || {};
    const hasName = typeof name === "string";
    const hasEmail = typeof email === "string";
    const hasCurrentPassword = typeof currentPassword === "string" && currentPassword.length > 0;
    const hasNewPassword = typeof newPassword === "string" && newPassword.length > 0;

    if (!hasName && !hasEmail && !hasCurrentPassword && !hasNewPassword) {
      return res.status(400).json({ message: "No profile updates provided" });
    }
    if (!hasCurrentPassword && hasNewPassword) {
      return res.status(400).json({ message: "Current password is required to set a new password" });
    }
    if (hasCurrentPassword && !hasNewPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    if (hasNewPassword && newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (hasName) {
      const normalizedName = String(name || "").trim();
      if (!normalizedName) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      user.name = normalizedName;
    }

    if (hasEmail) {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      if (!normalizedEmail) {
        return res.status(400).json({ message: "Email cannot be empty" });
      }

      const existingEmailOwner = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } }).select("_id");
      if (existingEmailOwner) {
        return res.status(409).json({ message: "Email already registered" });
      }

      user.email = normalizedEmail;
    }

    if (hasCurrentPassword && hasNewPassword) {
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      user.password = newPassword;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: buildSafeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    const { currentPassword } = req.body || {};

    if (typeof currentPassword !== "string" || !currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    const user = await User.findById(req.user.userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Only admin account deletion is supported here" });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const session = await User.startSession();
    try {
      await session.withTransaction(async () => {
        await Task.deleteMany({ adminId: user._id }, { session });
        await Project.deleteMany({ adminId: user._id }, { session });
        await User.deleteMany({ adminId: user._id, role: "Member" }, { session });
        await User.deleteOne({ _id: user._id }, { session });
      });
    } finally {
      await session.endSession();
    }

    return res.status(200).json({
      message: "Admin account and workspace deleted permanently",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerAdmin,
  login,
  getMe,
  updateMe,
  deleteMe,
};
