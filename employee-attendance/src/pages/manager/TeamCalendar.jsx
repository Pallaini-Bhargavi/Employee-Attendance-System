import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import API from "../../api/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import PageHeader from "../../components/PageHeader";   

function TeamCalendar() {
  const { token } = useSelector((state) => state.auth);

  const [employee, setEmployee] = useState("");
  const [records, setRecords] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const statusColors = {
    present: "green",
    absent: "red",
    late: "orange",
  };

  // ========= FETCH ALL ATTENDANCE =========
  const loadData = async () => {
    try {
      const res = await API.get("/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords(res.data);

      // Initial events
      setFilteredEvents(
        res.data.map((r) => ({
          title: `${r.userId?.name} - ${r.status.toUpperCase()}`,
          date: r.date,
          color: statusColors[r.status] || "gray",
        }))
      );
    } catch (err) {
      toast.error("Failed to load team calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ========= APPLY FILTER =========
  const applyFilter = () => {
    if (!employee.trim()) {
      setFilteredEvents(
        records.map((r) => ({
          title: `${r.userId?.name} - ${r.status.toUpperCase()}`,
          date: r.date,
          color: statusColors[r.status] || "gray",
        }))
      );
      return;
    }

    const filtered = records.filter((r) =>
      r.userId?.name?.toLowerCase().includes(employee.toLowerCase())
    );

    if (filtered.length === 0) {
      toast.error("No matching employee found");
      setFilteredEvents([]);
      return;
    }

    setFilteredEvents(
      filtered.map((r) => ({
        title: `${r.userId?.name} - ${r.status.toUpperCase()}`,
        date: r.date,
        color: statusColors[r.status],
      }))
    );
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading Team Calendar…</Typography>;
  }

  return (
    <Box sx={{ p: 4, background: "#f4f5f7", minHeight: "100vh" }}>

      {/* 🔹 Add Back + Home Buttons */}
      <PageHeader />

      <Typography variant="h4" fontWeight="bold" mb={3}>
        Team Calendar View
      </Typography>

      {/* ===== FILTER BOX ===== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Employee Name"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: { xs: 2, md: 0 }, py: 1.4 }}
              onClick={applyFilter}
            >
              SEARCH
            </Button>
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: { xs: 2, md: 0 }, py: 1.4 }}
              onClick={() => {
                setEmployee("");
                applyFilter();
              }}
            >
              RESET
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== NO DATA MESSAGE ===== */}
      {filteredEvents.length === 0 && (
        <Paper sx={{ p: 3, mb: 3, background: "#fff2f2" }}>
          <Typography color="red" fontWeight="bold">
            No attendance records found.
          </Typography>
        </Paper>
      )}

      {/* ===== CALENDAR ===== */}
      <Paper sx={{ p: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={filteredEvents}
          height="80vh"
        />
      </Paper>

    </Box>
  );
}

export default TeamCalendar;
