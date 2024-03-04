// Header.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { logout, token } = useAuth();
  const { themeClass, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverClass, setHoverClass] = useState("");

  const handleLogin = () => {
    navigate("/login");
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const handleRegister = () => {
    navigate("/register");
    closeMenu();
  };

  const handleNotes = () => {
    navigate("/");
    closeMenu();
  };

  const handleAddNote = () => {
    navigate("/noteForm");
    closeMenu();
  };

  const toggleHoverClass = () => {
    setHoverClass(
      themeClass === "bg-gray-800 text-white" ? "gray-700" : "gray-300"
    );
  };

  const resetHoverClass = () => {
    setHoverClass("");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className={`bg-${themeClass}`}>
      <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b-2">
        <div className="flex items-center">
          <h2 className={`text-4xl font-bold p-2 m-2 ${themeClass}`}>
            WonderNotes✒️
          </h2>
        </div>
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className={`w-6 h-6 text-${themeClass} hover:text-${hoverClass}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <nav className={`md:flex md:items-center md:w-auto ${menuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            <button
              onClick={toggleDarkMode}
              className={`bg-${themeClass} font-bold px-4 py-2 rounded`}
              onMouseEnter={toggleHoverClass}
              onMouseLeave={resetHoverClass}
            >
              {themeClass === "bg-gray-800 text-white"
                ? "Modo Claro"
                : "Modo Oscuro"}
            </button>
            <button
              onClick={handleNotes}
              className={`p-2 rounded-lg hover:bg-${hoverClass}`}
              onMouseEnter={toggleHoverClass}
              onMouseLeave={resetHoverClass}
            >
              Notas
            </button>
            <button
              onClick={handleAddNote}
              className={`p-2 rounded-lg hover:bg-${hoverClass}`}
              onMouseEnter={toggleHoverClass}
              onMouseLeave={resetHoverClass}
            >
              Añadir nota
            </button>
            {!token && (
              <div>
                <button
                  onClick={handleLogin}
                  className={`p-2 rounded-lg hover:bg-${hoverClass}`}
                  onMouseEnter={toggleHoverClass}
                  onMouseLeave={resetHoverClass}
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className={`p-2 rounded-lg hover:bg-${hoverClass}`}
                  onMouseEnter={toggleHoverClass}
                  onMouseLeave={resetHoverClass}
                >
                  Register
                </button>
              </div>
            )}
            {token && (
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg hover:bg-${hoverClass}`}
                onMouseEnter={toggleHoverClass}
                onMouseLeave={resetHoverClass}
              >
                Logout
              </button>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
