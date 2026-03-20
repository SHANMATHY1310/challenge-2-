const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

// import routes
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")

const app = express()

// middleware
app.use(cors())
app.use(express.json())


// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/taskdb")
.then(()=>{
    console.log("MongoDB Connected ")
})
.catch((err)=>{
    console.log("MongoDB Connection Error :", err.message)
    console.log("Server will continue without database...")
})

// routes
app.use("/auth", authRoutes)
app.use("/tasks", taskRoutes)

// test route
app.get("/",(req,res)=>{
    res.send("API Running Successfully")
})

// port
const PORT = 5000

// start server
app.listen(PORT,()=>{
    console.log("Server running on port",PORT)
})