const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail || !cleanPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(cleanPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, token, admin: { email: admin.email } });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
};

const getMe = (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
};

module.exports = {
  login,
  logout,
  getMe,
};
