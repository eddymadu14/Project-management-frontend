
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import VerifyEmailSuccess from "./components/verifySuccess";
import VerifyEmailFailed from "./components/verifyFailed";

import ProtectedRoute from "./routes/ProtectedRoutes";
import { useLoginUser, useRegisterUser, useLogout } from "./hooks/mutations";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/Landin";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Projects";

import Profile from "./pages/Profile";
import ProjectOrganizer from "./pages/ProjectOrganizer";
import TeamManagement from "./pages/TeamManagement";

import Analytics from "./pages/Analytics";

import Advanced from "./pages/Advanced";
import Settings from "./pages/Settings";
import RegisterAdmin from "./pages/AdminReg";
import Checkout from "./pages/Checkout";
import Cancel from "./pages/Cancel";
import AdminUsers from "./pages/admin/Users";
import AdminTransactions from "./pages/admin/Transactions";
import AdminLogs from "./pages/admin/Logs";
import Projects from "./pages/Projects";
import Team from "./pages/Team";

import Organizer from "./pages/Cancel";

// Routes
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import Proj from "./pages/Success";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
            <Route path="/" element={<LandingPage />} />
                        <Route path="/landing" element={<LandingPage />} />


      
      
         <Route path="verify-success" element={< VerifyEmailSuccess />} />
         
         <Route path="verify-failed" element={< VerifyEmailFailed />} />    

      {/* Protected dashboard routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="project-organizer" element={<ProjectOrganizer />} />
        <Route path="teammanagement" element={<TeamManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="projects" element={<Project />} />
        <Route path="profile" element={<Profile />} />
        <Route path="team" element={<Team />} />
        <Route path="success" element={<Proj />} />
        <Route path="project-organizer/project:Id" element={<ProjectOrganizer />} />
        
        <Route path="organize2" element={<Organizer />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminUsers />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>

      {/* Misc pages */}
      <Route path="/register-admin" element={<RegisterAdmin />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;