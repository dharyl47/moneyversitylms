import React from "react";
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-row justify-start">
      <Navbar/>
      <Sidebar />
      <div className="bg-primary flex-1 p-4 mt-20 text-white">
          {children}
      </div>
    </div>
  );
};

export default Layout;
