// Header.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { logout, token } = useAuth();
  const { themeClass, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [hoverClass, setHoverClass] = useState("");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleNotes = () => {
    navigate("/");
  };

  const handleAddNote = () => {
    navigate("/noteForm");
  };

  const toggleHoverClass = () => {
    setHoverClass(
      themeClass === "bg-gray-800 text-white" ? "gray-700" : "gray-300"
    );
  };

  const resetHoverClass = () => {
    setHoverClass("");
  };

  return (
    <div className={`bg-${themeClass}`}>
      <div className="flex flex-row justify-evenly col-span-6 p-4 border-b-2">
        <h2 className={`text-4xl font-bold p-2 m-2 ${themeClass}`}>
          WonderNotes✒️
        </h2>
        <nav>
          <ul className="flex flex-row justify-between p-4">
            <button
              onClick={toggleDarkMode}
              className={`bg-${themeClass}  font-bold px-4 py-2 rounded`}
              onMouseEnter={toggleHoverClass}
              onMouseLeave={resetHoverClass}
            >
              {themeClass === "bg-gray-800 text-white"
                ? "Modo Claro"
                : "Modo Oscuro"}
            </button>
            <button
              onClick={handleNotes}
              className={`p-2 m-2 rounded-lg hover:bg-${hoverClass}`}
              onMouseEnter={toggleHoverClass}
              onMouseLeave={resetHoverClass}
            >
              Notas
            </button>
            <button
              onClick={handleAddNote}
              className={`p-2 m-2 rounded-lg hover:bg-${hoverClass}`}
              onMouseEnter={toggleHoverClass}
              onMouseLeave={resetHoverClass}
            >
              Añadir nota
            </button>
            {!token && (
              <div>
                <button
                  onClick={handleLogin}
                  className={`p-2 m-2 rounded-lg hover:bg-${hoverClass}`}
                  onMouseEnter={toggleHoverClass}
                  onMouseLeave={resetHoverClass}
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className={`p-2 m-2 rounded-lg hover:bg-${hoverClass}`}
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
                className={`p-2 m-2 rounded-lg hover:bg-${hoverClass}`}
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
