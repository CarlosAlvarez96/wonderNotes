// ThemeContext.js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Definir las clases de Tailwind para los temas
  const themeClasses = {
    light: 'bg-gray-100 text-black', // Ajusta según tus estilos de Tailwind para el tema claro
    dark: 'bg-gray-800 text-white', // Ajusta según tus estilos de Tailwind para el tema oscuro
  };

  const themeClass = darkMode ? themeClasses.dark : themeClasses.light;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, themeClass }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
