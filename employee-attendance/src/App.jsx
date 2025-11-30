import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/employee/Login";
import Register from "./pages/employee/Register";

import EmployeeDashboard from "./pages/employee/Dashboard";
import MyHistory from "./pages/employee/MyHistory";


import ManagerDashboard from "./pages/manager/Dashboard";
import AllAttendance from "./pages/manager/AllAttendance";
import TeamCalendar from "./pages/manager/TeamCalendar";
import Reports from "./pages/manager/Reports";
import ManagerLogin from "./pages/manager/ManagerLogin";

import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Home page (default) */}
        <Route path="/" element={<HomePage />} />

        {/* Employee Auth */}
        <Route path="/employee/login" element={<Login />} />
        <Route path="/employee/register" element={<Register />} />

        {/* Employee Dashboard pages */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/history" element={<MyHistory />} />

        {/* Manager Login */}
        <Route path="/manager/login" element={<ManagerLogin />} />

        {/* Manager Dashboard pages */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/all-attendance" element={<AllAttendance />} />
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/manager/team-calendar" element={<TeamCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;
