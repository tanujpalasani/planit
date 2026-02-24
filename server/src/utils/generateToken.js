const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role,
    adminId: user.role === "Admin" ? user._id : user.adminId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = generateToken;
