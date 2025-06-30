import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";

const Login = ({ onLogin }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState({ username: false, password: false });

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      navigate("/documents");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      onLogin(); // ✅ Notify App
      navigate("/documents");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const styles = {
    form: {
      maxWidth: 400,
      margin: "40px auto",
      padding: 30,
      border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fafafa",
      color: isDarkMode ? "#fff" : "#000",
    },
    input: {
      width: "100%",
      padding: 12,
      marginBottom: 20,
      borderRadius: 6,
      border: "1.5px solid",
      fontSize: 16,
      backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
      color: isDarkMode ? "#f1f1f1" : "#000",
      boxSizing: "border-box",
      transition: "border-color 0.3s ease",
    },
    focus: {
      borderColor: "#007bff",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: 14,
      borderRadius: 6,
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      fontSize: 18,
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    disabledButton: {
      backgroundColor: "#a0a0a0",
      cursor: "not-allowed",
    },
    message: {
      marginTop: 20,
      fontWeight: "600",
      textAlign: "center",
      padding: "10px 15px",
      borderRadius: 6,
      fontSize: 16,
      userSelect: "none",
      color: isDarkMode ? "#f8d7da" : "#721c24",
      backgroundColor: isDarkMode ? "#5a1e22" : "#f8d7da",
      border: "1px solid #f5c6cb",
    },
  };

  return (
    <div style={styles.form}>
      <h2 style={{ textAlign: "center", marginBottom: 25 }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          style={{
            ...styles.input,
            ...(isFocused.username ? styles.focus : {}),
          }}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setIsFocused({ ...isFocused, username: true })}
          onBlur={() => setIsFocused({ ...isFocused, username: false })}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          style={{
            ...styles.input,
            ...(isFocused.password ? styles.focus : {}),
          }}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsFocused({ ...isFocused, password: true })}
          onBlur={() => setIsFocused({ ...isFocused, password: false })}
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(username && password ? {} : styles.disabledButton),
          }}
          disabled={!username || !password}
        >
          Login
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default Login;
