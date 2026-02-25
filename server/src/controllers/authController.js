const User = require("../models/User");
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
    const { name, email } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedName || !normalizedEmail) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingEmailOwner = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } }).select("_id");
    if (existingEmailOwner) {
      return res.status(409).json({ message: "Email already registered" });
    }

    user.name = normalizedName;
    user.email = normalizedEmail;
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: buildSafeUser(user),
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
};
