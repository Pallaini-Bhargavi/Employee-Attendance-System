import PageHeader from "../../components/PageHeader";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import API from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

function EmployeeLogin() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/employee/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user in Redux
      dispatch(loginSuccess(res.data));

      toast.success("Login Successful!");

      // Always go to employee dashboard
      window.location.href = "/employee/dashboard";

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ p: 4, background: "#f5f6fa", minHeight: "100vh" }}>
      <Toaster />

      {/* 🔹 Back & Home Buttons */}
      <PageHeader />

      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper elevation={4} sx={{ padding: 4, width: 380 }}>
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Employee Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, paddingY: 1.3 }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography mt={2} textAlign="center">
            Don’t have an account?{" "}
            <Link href="/employee/register" underline="hover">
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default EmployeeLogin;
