import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("pm_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Sync API header on token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // 🔄 Optional: Auto-logout if token becomes invalid
  useEffect(() => {
    if (!token) {
      localStorage.removeItem("pm_user");
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pm_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}