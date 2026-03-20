import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login() {

  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const url = isLogin 
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/register"
      
      const data = isLogin 
        ? { email, password }
        : { name, email, password }

      const res = await axios.post(url, data)

      if (isLogin) {
        // Save token for login
        localStorage.setItem("token", res.data.token)
        alert("Login Success ")
        navigate("/dashboard")
      } else {
        // Registration success
        alert("Registration Success  Please login")
        setIsLogin(true)
        setName("")
        setEmail("")
        setPassword("")
      }

    } catch (err) {
      console.log(err.response?.data)
      alert(isLogin ? "Login Failed " : "Registration Failed ")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      
      <div style={{
        background: "#1e293b",
        padding: "40px",
        borderRadius: "15px",
        maxWidth: "400px",
        width: "100%",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>
        
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          {isLogin ? " Login" : " Register"}
        </h2>

        {!isLogin && (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                background: "#334155",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              background: "#334155",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              background: "#334155",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px",
            background: isLogin ? "#3b82f6" : "#10b981",
            border: "none",
            color: "white",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
            transition: "background 0.3s"
          }}
          onMouseOver={(e) => e.target.style.background = isLogin ? "#2563eb" : "#059669"}
          onMouseOut={(e) => e.target.style.background = isLogin ? "#3b82f6" : "#10b981"}
        >
          {isLogin ? " Login" : " Register"}
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#94a3b8" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              marginLeft: "8px",
              fontSize: "14px",
              textDecoration: "underline"
            }}
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </div>

      </div>

    </div>
  )
}

export default Login