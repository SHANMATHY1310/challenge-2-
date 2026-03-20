import { useEffect, useState } from "react"
import axios from "axios"

function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("all") // all, active, completed

  // 🔄 FETCH TASKS
  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTasks(res.data.tasks || res.data)
    } catch (err) {
      console.log(err)
      alert("Failed to fetch tasks ❌")
    } finally {
      setIsLoading(false)
    }
  }

  // ➕ ADD TASK
  const addTask = async () => {
    if (!title.trim()) {
      alert("Title required ⚠️")
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      await axios.post(
        "http://localhost:5000/tasks",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Task Added ✅")
      setTitle("")
      setDescription("")
      fetchTasks()
    } catch (err) {
      console.log(err.response?.data)
      alert("Error adding task ❌")
    } finally {
      setIsLoading(false)
    }
  }

  // ❌ DELETE TASK
  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert("Task Deleted 🗑️")
      fetchTasks()
    } catch (err) {
      alert("Error deleting ❌")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ TOGGLE COMPLETE
  const toggleComplete = async (task) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      await axios.put(
        `http://localhost:5000/tasks/${task._id}`,
        { ...task, completed: !task.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchTasks()
    } catch (err) {
      alert("Error updating ❌")
    } finally {
      setIsLoading(false)
    }
  }

  // 🔐 LOGOUT
  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  // 🔁 LOAD ON START
  useEffect(() => {
    fetchTasks()
  }, [])

  // 🎯 FILTER TASKS
  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  // 📊 TASK STATS
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      color: "white",
      padding: "30px 20px"
    }}>

      {/* 🔐 HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        maxWidth: "1200px",
        margin: "0 auto 40px"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          margin: 0,
          background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          📋 Task Dashboard
        </h1>
        
        <button onClick={logout} style={{
          padding: "12px 24px",
          background: "linear-gradient(45deg, #ef4444, #dc2626)",
          border: "none",
          borderRadius: "10px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)"
          e.target.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)"
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)"
          e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)"
        }}>
          Logout 🔐
        </button>
      </div>

      {/* 📊 STATS CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto 40px"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>{stats.total}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Tasks</p>
        </div>
        
        <div style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>{stats.completed}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Completed</p>
        </div>
        
        <div style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>{stats.active}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Active</p>
        </div>
      </div>

      {/* 📊 CHARTS SECTION */}
      {stats.total > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto 40px"
        }}>
          
          {/* 🥧 PIE CHART */}
          <div style={{
            background: "rgba(30, 41, 59, 0.8)",
            backdropFilter: "blur(10px)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            textAlign: "center"
          }}>
            <h3 style={{ marginBottom: "25px", fontSize: "1.5rem" }}>📊 Task Progress</h3>
            
            <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto 20px" }}>
              <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="20"
                />
                
                {/* Completed tasks */}
                {stats.completed > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${(stats.completed / stats.total) * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                    strokeLinecap="round"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))"
                    }}
                  />
                )}
                
                {/* Active tasks */}
                {stats.active > 0 && (
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray={`${(stats.active / stats.total) * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                    strokeDashoffset={`-${(stats.completed / stats.total) * 2 * Math.PI * 80}`}
                    strokeLinecap="round"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))"
                    }}
                  />
                )}
              </svg>
              
              {/* Center text */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {Math.round((stats.completed / stats.total) * 100)}%
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>Complete</div>
              </div>
            </div>
            
            {/* Legend */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#10b981"
                }}></div>
                <span>Completed ({stats.completed})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#f59e0b"
                }}></div>
                <span>Active ({stats.active})</span>
              </div>
            </div>
          </div>

          {/* 📊 BAR CHART */}
          <div style={{
            background: "rgba(30, 41, 59, 0.8)",
            backdropFilter: "blur(10px)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
          }}>
            <h3 style={{ marginBottom: "25px", fontSize: "1.5rem", textAlign: "center" }}>📊 Task Distribution</h3>
            
            <div style={{ height: "200px", display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: "20px" }}>
              {/* Completed Bar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: "60px",
                  height: `${stats.total > 0 ? (stats.completed / stats.total) * 150 : 0}px`,
                  background: "linear-gradient(45deg, #10b981, #059669)",
                  borderRadius: "10px 10px 0 0",
                  transition: "all 0.3s",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#10b981"
                  }}>
                    {stats.completed}
                  </div>
                </div>
                <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#94a3b8" }}>Completed</div>
              </div>
              
              {/* Active Bar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: "60px",
                  height: `${stats.total > 0 ? (stats.active / stats.total) * 150 : 0}px`,
                  background: "linear-gradient(45deg, #f59e0b, #d97706)",
                  borderRadius: "10px 10px 0 0",
                  transition: "all 0.3s",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#f59e0b"
                  }}>
                    {stats.active}
                  </div>
                </div>
                <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "#94a3b8" }}>Active</div>
              </div>
            </div>
          </div>

          {/* 📈 LINE CHART */}
          <div style={{
            background: "rgba(30, 41, 59, 0.8)",
            backdropFilter: "blur(10px)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            gridColumn: "1 / -1"
          }}>
            <h3 style={{ marginBottom: "25px", fontSize: "1.5rem", textAlign: "center" }}>📈 Task Completion Trend</h3>
            
            <div style={{ height: "200px", position: "relative" }}>
              <svg width="100%" height="200" style={{ overflow: "visible" }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((line) => (
                  <line
                    key={line}
                    x1="0"
                    y1={200 - (line * 2)}
                    x2="100%"
                    y2={200 - (line * 2)}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Sample line chart data */}
                <polyline
                  points="50,150 150,120 250,100 350,80 450,60"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                
                {/* Data points */}
                {[50, 150, 250, 350, 450].map((x, index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={[150, 120, 100, 80, 60][index]}
                    r="5"
                    fill="#8b5cf6"
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              
              {/* X-axis labels */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                fontSize: "0.8rem",
                color: "#94a3b8"
              }}>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ➕ ADD TASK */}
      <div style={{
        background: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(10px)",
        padding: "30px",
        borderRadius: "20px",
        maxWidth: "600px",
        margin: "0 auto 40px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
      }}>
        <h3 style={{ marginBottom: "20px", textAlign: "center" }}>➕ Add New Task</h3>

        <input
          type="text"
          placeholder="📝 Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          style={{ 
            width: "100%", 
            padding: "15px", 
            marginBottom: "15px",
            background: "rgba(51, 65, 85, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            color: "white",
            fontSize: "16px",
            boxSizing: "border-box"
          }}
        />

        <textarea
          placeholder="📄 Task description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "15px", 
            marginBottom: "20px",
            background: "rgba(51, 65, 85, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            color: "white",
            fontSize: "16px",
            minHeight: "80px",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />

        <button 
          onClick={addTask}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "15px",
            background: isLoading 
              ? "#64748b" 
              : "linear-gradient(45deg, #10b981, #059669)",
            border: "none",
            color: "white",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            boxShadow: isLoading ? "none" : "0 10px 25px rgba(16, 185, 129, 0.3)"
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 15px 35px rgba(16, 185, 129, 0.4)"
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 10px 25px rgba(16, 185, 129, 0.3)"
            }
          }}
        >
          {isLoading ? "⏳ Adding..." : "➕ Add Task"}
        </button>
      </div>

      {/* 🎯 FILTER TABS */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "30px",
        maxWidth: "400px",
        margin: "0 auto 30px"
      }}>
        {["all", "active", "completed"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              padding: "10px 20px",
              background: filter === filterType 
                ? "linear-gradient(45deg, #3b82f6, #2563eb)"
                : "rgba(51, 65, 85, 0.8)",
              border: "none",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s",
              fontWeight: filter === filterType ? "bold" : "normal"
            }}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* 📋 TASK LIST */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        {isLoading && tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📝</div>
            <h3 style={{ marginBottom: "10px" }}>
              {filter === "completed" ? "No completed tasks 😔" : 
               filter === "active" ? "No active tasks 😔" : 
               "No tasks found 😔"}
            </h3>
            <p style={{ opacity: 0.7 }}>
              {filter === "all" ? "Add your first task above!" : "Try changing the filter"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {filteredTasks.map((task) => (
              <div 
                key={task._id} 
                style={{
                  background: task.completed 
                    ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))"
                    : "rgba(30, 41, 59, 0.8)",
                  backdropFilter: "blur(10px)",
                  padding: "20px",
                  borderRadius: "15px",
                  border: task.completed 
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.3)"
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginTop: "2px",
                      cursor: "pointer",
                      accentColor: "#10b981"
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: "0 0 10px 0",
                      textDecoration: task.completed ? "line-through" : "none",
                      opacity: task.completed ? 0.7 : 1,
                      fontSize: "1.2rem",
                      color: task.completed ? "#10b981" : "white"
                    }}>
                      {task.title}
                    </h3>

                    {task.description && (
                      <p style={{
                        margin: "0 0 15px 0",
                        opacity: task.completed ? 0.6 : 0.8,
                        lineHeight: "1.5"
                      }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <small style={{ opacity: 0.5 }}>
                        📅 {new Date(task.createdAt).toLocaleDateString()}
                      </small>

                      <button 
                        onClick={() => deleteTask(task._id)}
                        style={{
                          background: "linear-gradient(45deg, #ef4444, #dc2626)",
                          border: "none",
                          padding: "8px 16px",
                          color: "white",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.3s",
                          fontSize: "14px",
                          fontWeight: "bold"
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = "scale(1.05)"
                          e.target.style.boxShadow = "0 5px 15px rgba(239, 68, 68, 0.3)"
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "scale(1)"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        Delete ❌
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard