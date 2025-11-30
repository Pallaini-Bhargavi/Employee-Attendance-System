const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  checkIn,
  checkOut,
  getTodayStatus,
  getMySummary,
  getMyHistory,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  getTodayStatusList,
  getReportData,     // <-- MUST BE HERE!
} = require("../controllers/attendanceController");

// EMPLOYEE
router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/today", protect, getTodayStatus);
router.get("/my-summary", protect, getMySummary);
router.get("/my-history", protect, getMyHistory);

// MANAGER
router.get("/all", protect, getAllAttendance);
router.get("/employee/:id", protect, getEmployeeAttendance);
router.get("/summary", protect, getTeamSummary);
router.get("/today-status", protect, getTodayStatusList);

// REPORTS
//router.get("/report", protect, getReportData);

module.exports = router;
