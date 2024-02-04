const express = require("express");
const userController = require("../controller/userController");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();

// ------BACKEND-------
router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);
router.post("/dashboard", userController.userDashboard);

module.exports = router;
