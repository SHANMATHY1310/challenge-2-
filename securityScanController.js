const SecurityScan = require("../models/SecurityScan")

// ➕ CREATE SECURITY SCAN
const createSecurityScan = async (req, res) => {
  try {
    const { repositoryName, findings = [] } = req.body

    if (!repositoryName) {
      return res.status(400).json({ message: "Repository name is required ⚠️" })
    }

    const newScan = new SecurityScan({
      repositoryName,
      findings,
      status: "Queued",
      user: req.userId
    })

    await newScan.save()

    res.status(201).json({
      message: "Security scan created successfully ✅",
      scan: newScan
    })

  } catch (error) {
    console.error("Create Security Scan Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// 📋 GET ALL SECURITY SCANS
const getSecurityScans = async (req, res) => {
  try {
    const scans = await SecurityScan.find({ user: req.userId })
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: "Security scans fetched successfully ✅",
      scans
    })

  } catch (error) {
    console.error("Get Security Scans Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// 🔍 GET SINGLE SECURITY SCAN
const getSecurityScan = async (req, res) => {
  try {
    const { id } = req.params

    const scan = await SecurityScan.findOne({
      _id: id,
      user: req.userId
    })

    if (!scan) {
      return res.status(404).json({ message: "Security scan not found ⚠️" })
    }

    res.status(200).json({
      message: "Security scan fetched successfully ✅",
      scan
    })

  } catch (error) {
    console.error("Get Security Scan Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// ✏️ UPDATE SECURITY SCAN
const updateSecurityScan = async (req, res) => {
  try {
    const { id } = req.params
    const { status, findings } = req.body

    const updateData = {}
    if (status) {
      updateData.status = status
      if (status === "In Progress") {
        updateData.scanningAt = new Date()
      } else if (status === "Success" || status === "Failure") {
        updateData.finishedAt = new Date()
      }
    }
    if (findings) {
      updateData.findings = findings
    }

    const updatedScan = await SecurityScan.findOneAndUpdate(
      { _id: id, user: req.userId },
      updateData,
      { new: true }
    )

    if (!updatedScan) {
      return res.status(404).json({ message: "Security scan not found ⚠️" })
    }

    res.status(200).json({
      message: "Security scan updated successfully ✅",
      scan: updatedScan
    })

  } catch (error) {
    console.error("Update Security Scan Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

// ❌ DELETE SECURITY SCAN
const deleteSecurityScan = async (req, res) => {
  try {
    const { id } = req.params

    const deletedScan = await SecurityScan.findOneAndDelete({
      _id: id,
      user: req.userId
    })

    if (!deletedScan) {
      return res.status(404).json({ message: "Security scan not found ⚠️" })
    }

    res.status(200).json({
      message: "Security scan deleted successfully ✅",
      scan: deletedScan
    })

  } catch (error) {
    console.error("Delete Security Scan Error:", error)
    res.status(500).json({ message: "Server error ❌" })
  }
}

module.exports = {
  createSecurityScan,
  getSecurityScans,
  getSecurityScan,
  updateSecurityScan,
  deleteSecurityScan
}
