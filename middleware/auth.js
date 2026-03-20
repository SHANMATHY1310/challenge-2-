const jwt = require("jsonwebtoken")

// 🔐 AUTHENTICATION MIDDLEWARE
const auth = async (req, res, next) => {
  try {
    // 🎫 GET TOKEN FROM HEADER
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied ⚠️" })
    }

    // 🎯 VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key")

    // 👤 SET USER ID IN REQUEST
    req.userId = decoded.userId

    next()

  } catch (error) {
    console.error("Auth Middleware Error:", error)
    res.status(401).json({ message: "Token is not valid ⚠️" })
  }
}

module.exports = auth
