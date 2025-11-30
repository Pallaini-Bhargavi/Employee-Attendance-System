import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

import API from "../../api/api";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import PageHeader from "../../components/PageHeader";

function ManagerDashboard() {
  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    weeklyTrend: [],
    departmentData: [],
    absentList: [], // ✔ correct backend key
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const res = await API.get("/dashboard/manager", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data);
    } catch (err) {
      toast.error("Failed to load manager dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading)
    return <Typography sx={{ p: 4 }}>Loading Manager Dashboard…</Typography>;

  return (
    <Box sx={{ p: 4, background: "#f4f5f7" }}>
      <Toaster />
      <PageHeader />

      <Typography variant="h4" fontWeight="bold" mb={3}>
        Manager Dashboard 🧑‍💼
      </Typography>

      {/* ================= TOP CARDS ================= */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Employees</Typography>
            <Typography variant="h4" fontWeight="bold">
              {data.totalEmployees}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Present Today</Typography>
            <Typography variant="h4" fontWeight="bold" color="green">
              {data.presentToday}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Absent Today</Typography>
            <Typography variant="h4" fontWeight="bold" color="red">
              {data.absentToday}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ================= WEEKLY TREND ================= */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Weekly Attendance Trend
            </Typography>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={data.weeklyTrend.map((d) => ({
                  day: new Date(d._id).toDateString().slice(0, 10),
                  present: d.present,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#1976d2"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* ================= DEPARTMENT CHART ================= */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Department-wise Attendance
            </Typography>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={data.departmentData.map((d) => ({
                  dept: d._id,
                  present: d.totalPresent,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>

      {/* ================= NAVIGATION CARDS ================= */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              minHeight: 180,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.03)" },
              transition: "0.2s",
            }}
            onClick={() => (window.location.href = "/manager/all-attendance")}
          >
            <Typography variant="h5" fontWeight="bold">
              All Attendance
            </Typography>
            <Typography sx={{ mt: 2, color: "gray" }}>
              View all employee attendance
            </Typography>
            <Typography sx={{ mt: 2, color: "blue" , variant:"h5" ,fontWeight:"bold"}}>
              Check➡️
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              minHeight: 180,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.03)" },
              transition: "0.2s",
            }}
            onClick={() => (window.location.href = "/manager/reports")}
          >
            <Typography variant="h5" fontWeight="bold">
              Reports
            </Typography>
            <Typography sx={{ mt: 2, color: "gray" }}>
              Generate reports & CSV
            </Typography>
            <Typography sx={{ mt: 2, color: "blue" , variant:"h5" ,fontWeight:"bold"}}>
              Check➡️
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              minHeight: 180,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { transform: "scale(1.03)" },
              transition: "0.2s",
            }}
            onClick={() => (window.location.href = "/manager/team-calendar")}
          >
            <Typography variant="h5" fontWeight="bold">
              Team Calendar
            </Typography>
            <Typography sx={{ mt: 2, color: "gray" }}>
              View team attendance
            </Typography>
            <Typography sx={{ mt: 2, color: "blue" , variant:"h5" ,fontWeight:"bold"}}>
              Check➡️
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManagerDashboard;
