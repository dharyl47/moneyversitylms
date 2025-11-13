"use client";
import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const EXPANDED_SIDEBAR_WIDTH = 280;
  const COLLAPSED_SIDEBAR_WIDTH = 80;
  const sidebarWidth = isSidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : EXPANDED_SIDEBAR_WIDTH;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={handleSidebarToggle} />

      {/* Main Content */}
      <div 
        className="flex flex-col flex-1 bg-[#F9F9F9] text-[#282828]"
        style={{ 
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Content Area */}
        <div className="flex-1 p-4 transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
