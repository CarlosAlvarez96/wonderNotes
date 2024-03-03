import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ redirectPath }) => {
  const {token} = useAuth()
  // Obtener el token del localStorage
  const logged = token;
  
  // Verificar si el logged está presente
  if (!logged) {
    // Redirigir al usuario si no hay token
    return <Navigate to={redirectPath} replace />;
  }

  // Permitir el acceso si hay token
  return <Outlet />;
};

export default ProtectedRoute;
