const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ================= REGISTER EMPLOYEE =================
exports.registerEmployee = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      department,
      role: role || "employee",
    });

    res.json({
      token: generateToken(user._id),
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN EMPLOYEE =================
exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id),
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
