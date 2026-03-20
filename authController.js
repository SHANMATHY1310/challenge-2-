const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// 📝 REGISTER USER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 🔍 CHECK IF USER EXISTS
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ⚠️" })
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10)

    // 👤 CREATE NEW USER
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.status(201).json({ message: "User registered successfully ✅" })

  } catch (error) {
    console.error("Register Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// 🔐 LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 🔍 CHECK IF USER EXISTS
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials ⚠️" })
    }

    // 🔐 COMPARE PASSWORD
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ⚠️" })
    }

    // 🎫 CREATE JWT TOKEN
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" }
    )

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

module.exports = {
  register,
  login
}