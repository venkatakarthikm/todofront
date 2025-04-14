import React, { useState } from "react";
import axios from "axios";
import config from "../utils/config";
import "../css/styles.css";

const Register = ({ setLoggedIn, setShowRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${config}/auth/register`, { username, password });
      // Show success message and redirect to login
      setShowRegister(false);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={styles.authCard}>
        <h2 style={styles.authTitle}>Create an Account</h2>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              style={styles.input}
              required
            />
          </div>
          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p style={styles.switchText}>
          Already have an account?{" "}
          <span onClick={() => setShowRegister(false)} style={styles.switchLink}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  authCard: {
    maxWidth: "400px",
    margin: "80px auto 20px",
    padding: "30px",
  },
  authTitle: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#3498db",
    fontSize: "28px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#2c3e50",
  },
  input: {
    width: "100%",
  },
  submitButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  switchText: {
    marginTop: "25px",
    textAlign: "center",
    fontSize: "15px",
    color: "#7f8c8d",
  },
  switchLink: {
    color: "#3498db",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
  },
  errorMessage: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    color: "#e74c3c",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default Register;