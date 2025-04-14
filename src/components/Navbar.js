import React, { useState, useEffect } from "react";
import "../css/styles.css";

const Navbar = ({ loggedIn, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav style={{
      ...styles.navbar,
      boxShadow: scrolled ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
      backgroundColor: scrolled ? "#ffffff" : "rgba(255, 255, 255, 0.95)",
    }}>
      <div style={styles.navbarContainer}>
        <div style={styles.logoContainer}>
          <h1 style={styles.title}>TaskMaster</h1>
        </div>

        {/* Mobile menu button */}
        <div style={styles.mobileMenuButton} onClick={toggleMenu}>
          <div style={{
            ...styles.hamburgerLine,
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }}></div>
          <div style={{
            ...styles.hamburgerLine,
            opacity: menuOpen ? 0 : 1
          }}></div>
          <div style={{
            ...styles.hamburgerLine,
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
          }}></div>
        </div>

        {/* Navigation Links - show based on auth status and menu state on mobile */}
        <div style={{
          ...styles.navLinks,
          display: menuOpen ? 'flex' : 'none',
          '@media (min-width: 768px)': {
            display: 'flex'
          }
        }}>
          {loggedIn ? (
            <button onClick={onLogout} style={styles.logoutButton}>
              <svg style={styles.logoutIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    padding: "0.75rem 1.5rem",
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
  navbarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #3498db, #2980b9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    transition: "transform 0.3s ease",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.3s ease",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  logoutIcon: {
    width: "18px",
    height: "18px",
  },
  mobileMenuButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "24px",
    height: "18px",
    cursor: "pointer",
    "@media (min-width: 768px)": {
      display: "none",
    },
  },
  hamburgerLine: {
    width: "100%",
    height: "2px",
    backgroundColor: "#3498db",
    transition: "all 0.3s ease",
  },
  "@media (min-width: 768px)": {
    navLinks: {
      display: "flex !important",
      position: "static",
      flexDirection: "row",
      backgroundColor: "transparent",
      padding: 0,
      boxShadow: "none",
    }
  },
  // Apply these in CSS to handle the transitions and the mobile menu
  // I'm including these here for reference, but they'll be applied through the styles.css file
  responsive: `
    @media (max-width: 767px) {
      .nav-links {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background-color: white;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  `
};

export default Navbar;