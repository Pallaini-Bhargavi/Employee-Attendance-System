const express = require("express");
const router = express.Router();

const { loginManager } = require("../controllers/managerController");

// Manager Login
router.post("/login", loginManager);

module.exports = router;
