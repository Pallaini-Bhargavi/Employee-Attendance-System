import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import API from "../../api/api";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import PageHeader from "../../components/PageHeader";   // <-- Added

function MyHistory() {
  const { token } = useSelector((state) => state.auth);

  const [view, setView] = useState("calendar");
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const statusColors = {
    present: "green",
    absent: "red",
    late: "orange",
  };

  // ========== FETCH ALL DATA ==========
  const loadHistory = async () => {
    try {
      const res1 = await API.get("/attendance/my-history");
      setHistory(res1.data);

      const res2 = await API.get("/attendance/my-summary");
      setSummary(res2.data);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, background: "#f0f2f5", minHeight: "100vh" }}>
      <Toaster />

      {/* 🔹 ADD BACK + HOME BUTTONS */}
      <PageHeader />

      {/* TITLE + TOGGLE */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Attendance History
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={view}
          onChange={(e, v) => v && setView(v)}
          sx={{ mt: 2 }}
        >
          <ToggleButton value="calendar">Calendar View</ToggleButton>
          <ToggleButton value="table">Table View</ToggleButton>
          <ToggleButton value="summary">Summary</ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* ========== CALENDAR VIEW ========== */}
      {view === "calendar" && (
        <Paper sx={{ p: 3 }}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="75vh"
            events={history.map((item) => ({
              title: item.status.toUpperCase(),
              date: item.date,
              color: statusColors[item.status] || "gray",
            }))}
          />
        </Paper>
      )}

      {/* ========== TABLE VIEW ========== */}
      {view === "table" && (
        <Paper sx={{ p: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Hours</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{new Date(row.date).toDateString()}</TableCell>
                  <TableCell style={{ color: statusColors[row.status] }}>
                    {row.status.toUpperCase()}
                  </TableCell>
                  <TableCell>{row.totalHours ? row.totalHours + " hrs" : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ========== SUMMARY VIEW ========== */}
      {view === "summary" && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Monthly Summary
          </Typography>

          <Typography>✅ Present Days: <b>{summary.present}</b></Typography>
          <Typography>❌ Absent Days: <b>{summary.absent}</b></Typography>
          <Typography>⏰ Late Days: <b>{summary.late}</b></Typography>
          <Typography>⏳ Hours Worked: <b>{summary.totalHours} hrs</b></Typography>
        </Paper>
      )}
    </Box>
  );
}

export default MyHistory;
