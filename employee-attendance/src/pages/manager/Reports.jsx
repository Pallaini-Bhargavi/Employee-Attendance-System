import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { useState } from "react";
import API from "../../api/api";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import PageHeader from "../../components/PageHeader";   

function Reports() {
  const { token } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    employee: "",
    start: "",
    end: "",
  });

  const [records, setRecords] = useState([]);

  const statusColor = {
    present: "green",
    absent: "red",
    late: "orange",
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ========== LOAD REPORT DATA ==========
  const loadReport = async () => {
    try {
      const params = {
        ...(filters.employee && { employee: filters.employee }),
        ...(filters.start && { start: filters.start }),
        ...(filters.end && { end: filters.end }),
      };

      const res = await API.get("/attendance/report", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords(res.data);
      toast.success("Report loaded");
    } catch (err) {
      toast.error("Failed to load reports");
    }
  };

  // ========== EXPORT CSV ==========
  const exportCSV = () => {
    if (records.length === 0) {
      toast.error("No data to export");
      return;
    }

    const header = "Name,Date,Check In,Check Out,Status,Total Hours\n";

    const rows = records
      .map((r) => {
        return `${r.userId?.name},${new Date(r.date).toDateString()},${
          r.checkInTime || "-"
        },${r.checkOutTime || "-"},${r.status},${r.totalHours || 0}`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_report.csv";
    link.click();
  };

  return (
    <Box sx={{ p: 4, background: "#f4f5f7", minHeight: "100vh" }}>
      <Toaster />

      <PageHeader />

      <Typography variant="h4" fontWeight="bold" mb={3}>
        Reports & CSV Export
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Employee ID"
              name="employee"
              value={filters.employee}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              name="start"
              InputLabelProps={{ shrink: true }}
              value={filters.start}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              name="end"
              InputLabelProps={{ shrink: true }}
              value={filters.end}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              sx={{ py: 1.2, mt: { xs: 2, md: 0 } }}
              onClick={loadReport}
            >
              LOAD
            </Button>
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          sx={{ mt: 3, py: 1.2 }}
          onClick={exportCSV}
        >
          EXPORT CSV
        </Button>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Total Hours</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {records.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.userId?.name}</TableCell>
                <TableCell>{new Date(r.date).toDateString()}</TableCell>
                <TableCell style={{ color: statusColor[r.status] }}>
                  {r.status.toUpperCase()}
                </TableCell>
                <TableCell>{r.totalHours || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default Reports;
