"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname(); // Correct way to get current path
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
    router.push("/");
  };

  const linkClasses = (path) =>
    `flex items-center p-2 rounded w-full transition-colors duration-200 ${
      pathname === path ? "text-[#50B848]" : "text-gray-900"
    }`;

  return (
<div
  className="h-full bg-white fixed shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-gray-900 transition-all duration-300 flex flex-col"
  style={{
    width: "250px",
    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
  }}
>

 {/* Title Section */}
 <div className="pl-3 mt-7 w-full text-left">
 <h1 className="text-lg font-semibold text-[#4FB748] leading-snug">
   <span className="relative inline-block">
     Gu
     <span className="relative inline-block">
       i
       <Image
         src="/images/mvhat.png"
         alt="Graduation cap"
         width={30.6}
         height={20.4}
         className="absolute left-1/2"
         style={{ 
           transform: 'translateX(-50%)',
           top: '-14px',
           width: '28.6px',
           height: '20.4px',
           maxWidth: '100px'
         }}
         unoptimized
       />
     </span>dance
   </span> for Inheritance <br />and assets (GIA)
 </h1>
 
 {/* Horizontal separator line */}
 <div 
   className="mt-4"
   style={{
     height: '1px',
     backgroundColor: '#E5E5E5',
     marginLeft: '-12px',
     marginRight: '0',
     width: 'calc(100% + 12px)'
   }}
 />
</div>


      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex flex-col mt-4 w-full border-none">
          <ul className="space-y-1 p-1 w-full border-none">
            <li>
              <Link href="/dashboard" className={linkClasses("/dashboard")}>
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                <span style={{ 
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: "18px"
                }}>
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link href="/user-control" className={linkClasses("/user-control")}>
                <FontAwesomeIcon icon={faUserGear} className="mr-2" />
                <span style={{ 
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: "18px"
                }}>
                  User Profile
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="mt-auto px-3 mb-3">
        <div 
          className="flex items-center p-3 rounded-lg"
          style={{
            backgroundColor: '#F1F2F2',
            borderRadius: '8px'
          }}
        >
          {/* Avatar */}
          <div 
            className="flex items-center justify-center rounded-full mr-3"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#50B848',
              flexShrink: 0
            }}
          >
            <FontAwesomeIcon 
              icon={faUser} 
              className="text-white"
              style={{ fontSize: '18px' }}
            />
          </div>
          
          {/* User Info */}
          <div className="flex flex-col">
            <span 
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#1F2937',
                lineHeight: '1.2'
              }}
            >
              {userData?.username || 'User'}
            </span>
            <span 
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.2',
                marginTop: '2px'
              }}
            >
              {userData?.type ? userData.type.charAt(0).toUpperCase() + userData.type.slice(1) : 'Admin'}
            </span>
          </div>
        </div>
      </div>

      {/* Logout at bottom */}
      <div className="pb-4 px-3">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded w-full hover:bg-gray-300 transition-colors duration-200"
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: "18px",
            color: "#374151"
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
