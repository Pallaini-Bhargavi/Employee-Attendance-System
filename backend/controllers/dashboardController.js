const Attendance = require("../models/Attendance");
const User = require("../models/User");
const moment = require("moment");

// Convert MongoDB date to weekday text
const getWeekDay = (date) => moment(date).format("ddd");

// ================= MANAGER DASHBOARD =================
exports.getManagerDashboard = async (req, res) => {
  const today = moment.utc().startOf("day").toDate();

  // Total employees
  const totalEmployees = await User.countDocuments({ role: "employee" });

  // Present today
  const presentToday = await Attendance.countDocuments({
    date: today,
    status: "present",
  });

  // Absent list
  const presentRecords = await Attendance.find({ date: today }).populate(
    "userId",
    "name department"
  );

  const presentIds = presentRecords
  .filter(r => r.userId)      
  .map(r => r.userId._id);


  const absentEmployees = await User.find({
    _id: { $nin: presentIds },
    role: "employee",
  }).select("name department");

  // Weekly trend
  const weekly = await Attendance.aggregate([
    {
      $group: {
        _id: "$date",
        present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 7 },
  ]);

  // Department Summary
  const departmentData = await User.aggregate([
    { $match: { role: "employee" } },
    {
      $lookup: {
        from: "attendances",
        localField: "_id",
        foreignField: "userId",
        as: "att",
      },
    },
    {
      $project: {
        dept: "$department",
        present: {
          $size: {
            $filter: {
              input: "$att",
              as: "a",
              cond: { $eq: ["$$a.status", "present"] },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$dept",
        totalPresent: { $sum: "$present" },
      },
    },
  ]);

  res.json({
    totalEmployees,
    presentToday,
    absentToday: totalEmployees - presentToday,
    weeklyTrend: weekly,
    departmentData,
    absentList: absentEmployees,
  });
};

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = moment.utc().startOf("day").toDate();

    const todayStatus = await Attendance.findOne({ userId, date: today });

    const monthStart = moment().startOf("month").toDate();
    const monthEnd = moment().endOf("month").toDate();

    const records = await Attendance.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd },
    })
      .sort({ date: -1 })
      .limit(7);

    const summary = {
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      totalHours: records.reduce(
        (sum, r) => sum + (Number(r.totalHours) || 0),
        0
      ),
    };

    res.json({
      todayStatus: !!todayStatus,
      summary,
      recent: records,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
