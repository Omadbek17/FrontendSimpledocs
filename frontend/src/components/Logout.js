import React, { useContext, useState } from 'react';
import { DarkModeContext } from "../context/DarkModeContext";


const Logout = ({ onLogout }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    padding: '10px 24px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: isDarkMode ? '#ff4d4f' : '#dc3545',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    marginLeft: '12px',
    fontWeight: 600,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: 'background-color 0.3s ease',
  };

  const hoverStyle = {
    backgroundColor: isDarkMode ? '#e03131' : '#c82333',
  };

  return (
    <button
      style={{ ...baseStyle, ...(isHovered ? hoverStyle : {}) }}
      onClick={onLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Logout
    </button>
  );
};

export default Logout;
