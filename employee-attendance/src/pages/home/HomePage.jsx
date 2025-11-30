import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {/* TOP DROPDOWN MENUS */}
      <Box
        sx={{
          position: "absolute",
          top: 50,
          right: 20,
          display: "flex",
          gap: 3,
          zIndex: 10,
        }}
      >
        {/* EMPLOYEE DROPDOWN */}
        <Box sx={{ position: "relative" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              fontSize: "19px",
              borderRadius: "10px",
              "&:hover": { bgcolor: "#115293" },
            }}
            onClick={() => {
              const menu = document.getElementById("emp-menu");
              menu.style.display = menu.style.display === "block" ? "none" : "block";
            }}
          >
            Employee ▼
          </Button>

          {/* EMPLOYEE MENU */}
          <Box
            id="emp-menu"
            sx={{
              display: "none",
              position: "absolute",
              top: "60px",
              right: 0,
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: "8px",
              overflow: "hidden",
              minWidth: "150px",
              zIndex: 20,
            }}
          >
            <Button
              fullWidth
              sx={{ justifyContent: "flex-start", px: 2, py: 1.2 }}
              onClick={() => navigate("/employee/login")}
            >
              Login
            </Button>

            <Button
              fullWidth
              sx={{ justifyContent: "flex-start", px: 2, py: 1.2 }}
              onClick={() => navigate("/employee/register")}
            >
              Register
            </Button>
          </Box>
        </Box>

        {/* MANAGER DROPDOWN */}
        <Box sx={{ position: "relative" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4caf50",
              color: "white",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              fontSize: "19px",
              borderRadius: "10px",
              "&:hover": { bgcolor: "#2e7d32" },
            }}
            onClick={() => {
              const menu = document.getElementById("mgr-menu");
              menu.style.display = menu.style.display === "block" ? "none" : "block";
            }}
          >
            Manager ▼
          </Button>

          {/* MANAGER MENU */}
          <Box
            id="mgr-menu"
            sx={{
              display: "none",
              position: "absolute",
              top: "60px",
              right: 0,
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: "8px",
              overflow: "hidden",
              minWidth: "150px",
              zIndex: 20,
            }}
          >
            <Button
              fullWidth
              sx={{ justifyContent: "flex-start", px: 2, py: 1.2 }}
              onClick={() => navigate("/manager/login")}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>

      {/* BACKGROUND IMAGE */}
      <Box
        component="img"
        src="https://www.zimyo.com/wp-content/uploads/2024/01/Employee-Management-System-scaled.jpg"
        alt="Employee Management"
        sx={{
          width: "100%",
          height: "106vh",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Box>
  );
}

export default HomePage;
