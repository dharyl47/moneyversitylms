"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={handleSidebarToggle} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-gray-300 text-white">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <div
          className={`flex-1 p-4 transition-all duration-300 mt-16 ${
            isSidebarCollapsed ? "ml-48" : "ml-48"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
