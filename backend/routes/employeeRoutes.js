const express = require("express");
const router = express.Router();

const { registerEmployee, loginEmployee } = require("../controllers/employeeController");

// Register employee
router.post("/register", registerEmployee);

// Login employee
router.post("/login", loginEmployee);

module.exports = router;
