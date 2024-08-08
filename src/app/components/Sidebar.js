"use client"
import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faCalculator, faFileAlt, faBook, faNewspaper, faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex h-screen ${isCollapsed ? 'w-16' : 'w-64'} bg-[#202020] text-white mt-16 transition-all duration-300`}>
      <div className="flex flex-col h-full items-center">
       
        <nav className="flex-1 flex flex-col justify-center items-center">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                {!isCollapsed && 'Home'}
              </Link>
            </li>
            <li>
              <Link href="#" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                <FontAwesomeIcon icon={faComments} className="mr-2" />
                {!isCollapsed && 'Chat Data'}
              </Link>
            </li>
            <li>
              <Link href="#" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                {!isCollapsed && 'Calculator'}
              </Link>
            </li>
            <li>
              <Link href="#" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                {!isCollapsed && 'Reports'}
              </Link>
            </li>
            <li>
              <Link href="/lms" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                <FontAwesomeIcon icon={faBook} className="mr-2" />
                {!isCollapsed && 'LMS'}
              </Link>
            </li>
            <li>
              <Link href="/engagingcontent" className={`flex items-center p-2 rounded hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                {!isCollapsed && 'Engaging Content'}
              </Link>
            </li>
          </ul>
          
        </nav>
        <button
          className="p-2 text-gray-400 hover:text-white focus:outline-none mb-28"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={isCollapsed ? faBars : faChevronLeft} />
        </button>
        
      </div>
      
    </div>
  );
};

export default Sidebar;
