
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/jwt";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = getUserRole();

  // // Client-side guard (backend must always verify)

  // if (!token) return <Navigate to="/login" replace />;
  // if (role !== "admin") return <Navigate to="/login" replace />;

  return children;
}

