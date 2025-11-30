const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ================= MANAGER LOGIN =================
exports.loginManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "manager" });
    if (!user) {
      return res.status(400).json({ message: "Manager not found" });
    }

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
