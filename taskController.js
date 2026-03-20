const Task = require("../models/Task")

// ➕ CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ message: "Title is required ⚠️" })
    }

    const newTask = new Task({
      title,
      description,
      user: req.userId // Assuming you have middleware that sets req.userId
    })

    await newTask.save()

    res.status(201).json({
      message: "Task created successfully ✅",
      task: newTask
    })

  } catch (error) {
    console.error("Create Task Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// 📋 GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 })

    res.status(200).json({
      message: "Tasks fetched successfully ✅",
      tasks
    })

  } catch (error) {
    console.error("Get Tasks Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// ❌ DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.userId
    })

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found ⚠️" })
    }

    res.status(200).json({
      message: "Task deleted successfully ✅",
      task: deletedTask
    })

  } catch (error) {
    console.error("Delete Task Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// ✏️ UPDATE TASK (TOGGLE COMPLETE)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, completed } = req.body

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, description, completed },
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found ⚠️" })
    }

    res.status(200).json({
      message: "Task updated successfully ✅",
      task: updatedTask
    })

  } catch (error) {
    console.error("Update Task Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

module.exports = {
  createTask,
  getTasks,
  deleteTask,
  updateTask
}
