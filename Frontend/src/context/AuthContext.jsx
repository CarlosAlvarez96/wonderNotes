import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [email, setEmailState] = useState(null);
  const [filteredTag, setFilteredTag] = useState();

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Borra el token al descargar la página
      logout();
    };

    // Agrega el evento beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Limpia el evento al desmontar el componente o al cambiar de página
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // El segundo argumento del useEffect [] asegura que este efecto solo se ejecute una vez al montar el componente

  return (
    <AuthContext.Provider value={{ token, email, setEmail: setEmailState, setFilteredTag, filteredTag, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
