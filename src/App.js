import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import Navbar from "./components/Navbar";
import "./css/styles.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in when the app loads
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  // Show a loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="loading-container" style={styles.loadingContainer}>
        <div className="spinner" style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar loggedIn={loggedIn} onLogout={handleLogout} />

      {/* Main Content */}
      <div style={{ paddingTop: "60px" }}>
        {loggedIn ? (
          <TaskList />
        ) : showRegister ? (
          <Register setLoggedIn={setLoggedIn} setShowRegister={setShowRegister} />
        ) : (
          <Login setLoggedIn={setLoggedIn} setShowRegister={setShowRegister} />
        )}
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "50%",
    borderTop: "4px solid #3498db",
    animation: "spin 1s linear infinite",
  },
};

export default App;