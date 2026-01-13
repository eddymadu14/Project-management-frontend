import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const savedToken = token || localStorage.getItem("token");

  if (!savedToken) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}