import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-orbit-bg text-orbit-text">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}