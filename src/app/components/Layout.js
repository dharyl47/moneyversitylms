"use client";
import React, { useState } from "react";
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
      <div 
        className="flex flex-col flex-1 bg-[#F9F9F9] text-[#282828]"
        style={{ marginLeft: '250px' }}
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
