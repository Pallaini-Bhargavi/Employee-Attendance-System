import PageHeader from "../../components/PageHeader";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Link,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import API from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const departments = ["Tech", "HR", "Sales", "Support"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.department) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const body = { ...form, role: "employee" };

      const res = await API.post("/employee/register", body);

      localStorage.setItem("token", res.data.token);
      dispatch(loginSuccess(res.data));

      toast.success("Registration Successful!");
      window.location.href = "/employee/login";

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ p: 4, background: "#f5f6fa", minHeight: "100vh" }}>
      <Toaster />

      <PageHeader />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Paper elevation={4} sx={{ padding: 4, width: 420 }}>
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Create an Account
          </Typography>

        
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            
            {/* Full Name */}
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              autoComplete="off"
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              autoComplete="off"
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              autoComplete="new-password"
            />

            {/* Department */}
            <TextField
              fullWidth
              select
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              margin="normal"
              autoComplete="off"
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, paddingY: 1.3 }}
              onClick={handleRegister}
            >
              Register
            </Button>

            <Typography mt={2} textAlign="center">
              Already have an account?{" "}
              <Link href="/employee/login" underline="hover">
                Login
              </Link>
            </Typography>
          </form>
          {/* END FORM */}
        </Paper>
      </Box>
    </Box>
  );
}

export default Register;
