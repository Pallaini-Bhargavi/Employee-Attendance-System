const express = require("express");     // ✅ MISSING LINE ADDED
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getEmployeeDashboard, getManagerDashboard } =
  require("../controllers/dashboardController");

// Employee Dashboard
router.get("/employee", protect, getEmployeeDashboard);

// Manager Dashboard
router.get("/manager", protect, getManagerDashboard);

module.exports = router;
