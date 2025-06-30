import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";

function Navbar() {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setShowMenu(false);
    // Optionally: Add toast alert
    // toast.success("Logged out successfully!");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow relative">
      <div className="relative" ref={menuRef}>
        <h1
          onClick={() => setShowMenu((prev) => !prev)}
          className="text-xl font-bold text-gray-800 dark:text-white cursor-pointer"
        >
          SimpleDocs
        </h1>
        {showMenu && (
          <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-50">
            <ul className="flex flex-col text-gray-800 dark:text-white">
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  setShowMenu(false);
                }}
              >
                Main Page
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  navigate("/create");
                  setShowMenu(false);
                }}
              >
                Create Document
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  navigate("/documents");
                  setShowMenu(false);
                }}
              >
                My Documents
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  navigate("/shared");
                  setShowMenu(false);
                }}
              >
                Shared with Me
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Example: Show user icon/avatar here in future */}
        {/* <img src={userAvatarURL} className="w-8 h-8 rounded-full" /> */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
