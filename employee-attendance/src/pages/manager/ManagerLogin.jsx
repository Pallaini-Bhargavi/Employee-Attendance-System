import PageHeader from "../../components/PageHeader";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import toast, { Toaster } from "react-hot-toast";
import API from "../../api/api";

function ManagerLogin() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email & password");
      return;
    }

    try {
      const res = await API.post("/manager/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user in redux
      dispatch(loginSuccess(res.data));

      toast.success("Manager Login Successful!");

      window.location.href = "/manager/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f4f5f7", p: 4 }}>
      <Toaster />

      {/* 🔹 Add Back + Home Buttons */}
      <PageHeader />

      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 420,
            borderRadius: "15px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
            Manager Login
          </Typography>

          <Typography variant="body1" textAlign="center" mb={3} color="gray">
            Please login to access the manager dashboard
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#2e7d32",
                fontSize: "18px",
                py: 1.2,
                fontWeight: "bold",
                "&:hover": { bgcolor: "#1b5e20" },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default ManagerLogin;
