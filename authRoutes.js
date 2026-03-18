const express = require("express")
const router = express.Router()

// ✅ import controller (VERY IMPORTANT)
const { register, login } = require("../Controllers/authController")

// REGISTER API
router.post("/register", register)

// LOGIN API
router.post("/login", login)

module.exports = router