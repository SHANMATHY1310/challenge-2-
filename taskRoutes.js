const express = require("express")
const router = express.Router()
const auth = require("../models/middleware/auth")

const {
  createTask,
  getTasks,
  deleteTask,
  updateTask
} = require("../Controllers/taskController")

// PROTECT ALL TASK ROUTES
router.use(auth)

router.post("/", createTask)
router.get("/", getTasks)
router.delete("/:id", deleteTask)
router.put("/:id", updateTask)

module.exports = router