const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");

// ================= EMPLOYEE =================

// CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = moment.utc().startOf("day").toDate();

    const exists = await Attendance.findOne({ userId, date: today });
    if (exists) return res.status(400).json({ message: "Already checked in today" });

    const record = await Attendance.create({
      userId,
      date: today,
      checkInTime: new Date(),
      status: "present",
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = moment.utc().startOf("day").toDate();

    const record = await Attendance.findOne({ userId, date: today });
    if (!record) return res.status(400).json({ message: "Check-in required" });

    record.checkOutTime = new Date();

    const diffMs = record.checkOutTime - record.checkInTime;
    record.totalHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TODAY STATUS
exports.getTodayStatus = async (req, res) => {
  const userId = req.user._id;
  const today = moment.utc().startOf("day").toDate();
  const record = await Attendance.findOne({ userId, date: today });
  res.json(record || { message: "Not checked in today" });
};

// MY SUMMARY
exports.getMySummary = async (req, res) => {
  const userId = req.user._id;
  const start = moment().startOf("month").toDate();
  const end = moment().endOf("month").toDate();

  const records = await Attendance.find({
    userId,
    date: { $gte: start, $lte: end },
  });

  res.json({
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    totalHours: records.reduce((s, r) => s + (r.totalHours || 0), 0),
  });
};

// MY HISTORY
exports.getMyHistory = async (req, res) => {
  const userId = req.user._id;
  const data = await Attendance.find({ userId }).sort({ date: -1 });
  res.json(data);
};

// ================= MANAGER =================

// ALL ATTENDANCE
exports.getAllAttendance = async (req, res) => {
  const records = await Attendance.find()
    .populate("userId", "name employeeId department")
    .sort({ date: -1 });

  res.json(records);
};

// SPECIFIC EMPLOYEE
exports.getEmployeeAttendance = async (req, res) => {
  const id = req.params.id;
  const data = await Attendance.find({ userId: id }).sort({ date: -1 });
  res.json(data);
};

// TEAM SUMMARY
exports.getTeamSummary = async (req, res) => {
  const today = moment.utc().startOf("day").toDate();

  const present = await Attendance.countDocuments({
    date: today,
    status: "present",
  });

  const total = await User.countDocuments({ role: "employee" });

  res.json({
    totalEmployees: total,
    presentToday: present,
    absentToday: total - present,
  });
};

// TODAY STATUS LIST
exports.getTodayStatusList = async (req, res) => {
  try {
    const today = moment.utc().startOf("day").toDate();

    // Get today's attendance with populated users
    const presentRecords = await Attendance.find({ date: today })
      .populate("userId", "name employeeId department");

    // Filter out broken/null records
    const cleanPresent = presentRecords.filter(r => r.userId !== null);

    // Collect present user IDs
    const presentIds = cleanPresent.map(r => r.userId._id.toString());

    // Employees NOT in presentIds = absent
    const absentEmployees = await User.find({
      _id: { $nin: presentIds },
      role: "employee",
    }).select("name employeeId department");

    res.json({
      present: cleanPresent,
      absent: absentEmployees,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= REPORT API =================

exports.getReportData = async (req, res) => {
  try {
    const { employee, start, end } = req.query;

    let query = {};

    if (employee) query.userId = employee;

    if (start && end) {
      query.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const records = await Attendance.find(query)
      .populate("userId", "name employeeId department")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Report fetch failed", error: err.message });
  }
};
