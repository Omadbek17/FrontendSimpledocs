import React, { useState, useContext, useEffect, useRef } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import api from "../utils/api";

const Register = ({ onRegisterSuccess }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false,
  });

  const usernameInputRef = useRef(null);

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setLoading(true);

    try {
      await api.post("/register/", {
        username: username.trim(),
        password: password.trim(),
      });
      setIsSuccess(true);
      setMessage("Registration successful! Please log in.");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        onRegisterSuccess?.();
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);
      setMessage(err.message || "Registration failed.");
    } finally {
      setLoading(false);
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
      color: isDarkMode ? "#f1f1f1" : "#222",
    },
    input: {
      width: "100%",
      padding: 12,
      marginBottom: 20,
      borderRadius: 6,
      border: `1.5px solid ${isDarkMode ? "#666" : "#bbb"}`,
      backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      fontSize: 16,
      boxSizing: "border-box",
      transition: "border-color 0.3s ease, background-color 0.3s ease",
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
    },
    success: {
      color: isDarkMode ? "#d4edda" : "#155724",
      backgroundColor: isDarkMode ? "#235c3b" : "#d4edda",
      border: isDarkMode ? "1px solid #88c3a7" : "1px solid #c3e6cb",
    },
    error: {
      color: isDarkMode ? "#f8d7da" : "#721c24",
      backgroundColor: isDarkMode ? "#5a1e22" : "#f8d7da",
      border: "1px solid #f5c6cb",
    },
  };

  return (
    <div style={styles.form}>
      <h2 style={{ textAlign: "center", marginBottom: 25 }}>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          ref={usernameInputRef}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() =>
            setIsFocused({ ...isFocused, username: true })
          }
          onBlur={() =>
            setIsFocused({ ...isFocused, username: false })
          }
          style={{
            ...styles.input,
            ...(isFocused.username ? styles.focus : {}),
          }}
          required
          autoComplete="username"
          aria-label="Username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() =>
            setIsFocused({ ...isFocused, password: true })
          }
          onBlur={() =>
            setIsFocused({ ...isFocused, password: false })
          }
          style={{
            ...styles.input,
            ...(isFocused.password ? styles.focus : {}),
          }}
          required
          autoComplete="new-password"
          aria-label="Password"
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(username && password && !loading
              ? {}
              : styles.disabledButton),
          }}
          disabled={!username || !password || loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && (
        <p
          style={{
            ...styles.message,
            ...(isSuccess ? styles.success : styles.error),
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;
