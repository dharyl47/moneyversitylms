import React from 'react';
import Image from 'next/image';

const Navbar = () => {
  return (
   <nav className="fixed z-30 w-full bg-transparent backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
  <div className="px-5 py-3 lg:px-10">
    <div className="flex items-center justify-center">
      {/* Sidebar Toggle (Optional for Mobile) */}
      <button
        id="toggleSidebarMobile"
        aria-expanded="true"
        aria-controls="sidebar"
        className="p-2 text-gray-600 rounded lg:hidden hover:text-gray-900 dark:text-gray-400 dark:hover:text-white absolute left-4"
      >
        <svg
          id="toggleSidebarMobileHamburger"
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
        <svg
          id="toggleSidebarMobileClose"
          className="hidden w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      {/* Centered Title */}
      <a href="/" className="flex justify-center items-center">
        <span className="self-center text-xl font-semibold text-white dark:text-white">
          Estate Planning AI
        </span>
      </a>

      {/* Right Side Icons */}
      <div className="absolute right-4 flex items-center space-x-3">
        {/* Search Bar */}
       
      </div>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
