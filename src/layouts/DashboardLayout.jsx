import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // ✅ Close sidebar automatically when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}