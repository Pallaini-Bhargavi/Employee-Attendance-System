import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button
} from "@mui/material";
import API from "../../api/api";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import PageHeader from "../../components/PageHeader";  // ✅ IMPORT

function EmployeeDashboard() {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    todayStatus: null,
    summary: {},
    recent: [],
  });

  // Fetch Dashboard Data
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Check-in
  const handleCheckIn = async () => {
    try {
      await API.post(
        "/attendance/checkin",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Checked In Successfully!");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-in failed");
    }
  };

  // Check-out
  const handleCheckOut = async () => {
    try {
      await API.post(
        "/attendance/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Checked Out Successfully!");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-out failed");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, background: "#f4f5f7", minHeight: "100vh" }}>

      {/* 🔹 Back + Home Header (ADDED) */}
      <PageHeader />

      <Toaster />

      <Typography variant="h4" fontWeight="bold" mb={3}>
        Employee Dashboard
      </Typography>

      <Grid container spacing={3}>

        {/* Today's Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, minHeight: 280 }}>
            <Typography variant="h5" fontWeight="bold">
              Today's Status
            </Typography>

            <Typography
              sx={{
                mt: 3,
                fontSize: "26px",
                fontWeight: "bold",
                color: data.todayStatus ? "green" : "red",
              }}
            >
              {data.todayStatus ? "✔ Checked In" : "✖ Not Checked In"}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mb: 2, py: 2, fontSize: "18px", fontWeight: "bold" }}
              onClick={handleCheckIn}
            >
              CHECK IN
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{ py: 2, fontSize: "18px", fontWeight: "bold" }}
              onClick={handleCheckOut}
            >
              CHECK OUT
            </Button>
          </Paper>
        </Grid>

        {/* Monthly Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, minHeight: 280 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Monthly Summary
            </Typography>

            <Typography sx={{ fontSize: "20px", mb: 1 }}>
              ✅ <b>Present:</b> {data.summary.present || 0}
            </Typography>

            <Typography sx={{ fontSize: "20px", mb: 1 }}>
              ❌ <b>Absent:</b> {data.summary.absent || 0}
            </Typography>

            <Typography sx={{ fontSize: "20px", mb: 1 }}>
              ⏰ <b>Late:</b> {data.summary.late || 0}
            </Typography>

            <Typography sx={{ fontSize: "22px", fontWeight: "bold", mt: 2 }}>
              ⏳ Hours Worked: {data.summary.totalHours || 0} hrs
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Attendance */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, minHeight: 280 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Recent Attendance (7 Days)
            </Typography>

            <List>
              {data.recent.length === 0 ? (
                <Typography>No records found</Typography>
              ) : (
                data.recent.map((item) => (
                  <ListItem key={item._id} sx={{ py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: "18px" }}>
                          {new Date(item.date).toDateString()}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            fontSize: "16px",
                            color:
                              item.status === "present"
                                ? "green"
                                : item.status === "absent"
                                ? "red"
                                : "orange",
                          }}
                        >
                          {item.status.toUpperCase()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

      </Grid>
      {/* Attendance History Navigation Card */}
<Grid container spacing={3} sx={{ mt: 4 }}>
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
      onClick={() => (window.location.href = "/employee/history")}
    >
      <Typography variant="h5" fontWeight="bold">
        Attendance History
      </Typography>
      <Typography sx={{ mt: 2, color: "gray" }}>
        View all your past attendance records
      </Typography>
      <Typography sx={{ mt: 2, color: "blue", fontWeight: "bold" }}>
        Check ➡️
      </Typography>
    </Paper>
  </Grid>
</Grid>

    </Box>
  );
}

export default EmployeeDashboard;
