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
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import API from "../../api/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import PageHeader from "../../components/PageHeader";   // ✅ ADDED

function AllAttendance() {
  const { token } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    employee: "",
    date: "",
    status: "",
  });

  const [records, setRecords] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColor = {
    present: "green",
    absent: "red",
    late: "orange",
  };

  // ========= LOAD ALL ATTENDANCE =========
  const loadAllAttendance = async () => {
    try {
      const res = await API.get("/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords(res.data);
      setFilteredData(res.data);
    } catch (err) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAttendance();
  }, []);

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);

    let data = [...records];

    if (updated.employee) {
      data = data.filter((r) =>
        r.userId?.name?.toLowerCase().includes(updated.employee.toLowerCase())
      );
    }

    if (updated.date) {
      data = data.filter((r) => {
        const recordDate = new Date(r.date).toISOString().slice(0, 10);
        return recordDate === updated.date;
      });
    }

    if (updated.status) {
      data = data.filter((r) => r.status === updated.status);
    }

    setFilteredData(data);
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading All Employees Attendance…</Typography>;
  }

  return (
    <Box sx={{ p: 4, background: "#f4f5f7", minHeight: "100vh" }}>
      
      <PageHeader />   {/* ✅ BACK + HOME ADDED */}

      <Typography variant="h4" fontWeight="bold" mb={3}>
        All Employees Attendance
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Employee Name"
              name="employee"
              value={filters.employee}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              InputLabelProps={{ shrink: true }}
              value={filters.date}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filteredData.length === 0 && (
        <Paper sx={{ p: 3, mb: 3, background: "#fff3f3" }}>
          <Typography color="red" fontWeight="bold">
            No attendance records found for the selected filters.
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Employee</b></TableCell>
              <TableCell><b>Employee ID</b></TableCell>
              <TableCell><b>Department</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Check In</b></TableCell>
              <TableCell><b>Check Out</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Total Hours</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.userId?.name}</TableCell>
                <TableCell>{item.userId?.employeeId}</TableCell>
                <TableCell>{item.userId?.department}</TableCell>

                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>

                <TableCell>
                  {item.checkInTime
                    ? new Date(item.checkInTime).toLocaleTimeString()
                    : "-"}
                </TableCell>

                <TableCell>
                  {item.checkOutTime
                    ? new Date(item.checkOutTime).toLocaleTimeString()
                    : "-"}
                </TableCell>

                <TableCell sx={{ color: statusColor[item.status] }}>
                  {item.status?.toUpperCase()}
                </TableCell>

                <TableCell>{item.totalHours || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default AllAttendance;
