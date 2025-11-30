const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Attendance Routes
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// Dashboard routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

//employee routes
app.use("/api/employee", require("./routes/employeeRoutes"));

//manager routes
app.use("/api/manager", require("./routes/managerRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

