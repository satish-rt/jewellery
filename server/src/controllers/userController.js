const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();
    const cleanPhone = (phone || "").trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const user = new User({
      name: cleanName,
      email: cleanEmail,
      hashedPassword: cleanPassword,
      phone: cleanPhone,
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail || !cleanPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(cleanPassword);
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = req.cookies.userToken || bearerToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-hashedPassword");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("userToken");
  res.status(200).json({ success: true, message: "Logged out" });
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-hashedPassword");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

const exportUsersCSV = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const header = "Name,Email,Phone,Registered On";
    const rows = users
      .map((u) =>
        [
          `"${u.name}"`,
          `"${u.email}"`,
          `"${u.phone || ""}"`,
          `"${new Date(u.createdAt).toLocaleDateString("en-IN")}"`,
        ].join(","),
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="rajlaxmi-users.csv"',
    );
    res.send(header + "\n" + rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  getUsers,
  exportUsersCSV,
};
