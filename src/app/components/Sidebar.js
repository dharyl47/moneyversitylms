"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { clearSession } from "../lib/authSession";
import {
  FiGrid,
  FiUserCheck,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname(); // Correct way to get current path
  const [userData, setUserData] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    label: "",
    top: 0,
    left: 0,
  });

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

  const expandedWidth = 280;
  const collapsedWidth = 80;
  const sidebarWidth = isCollapsed ? collapsedWidth : expandedWidth;
  const horizontalPadding = isCollapsed ? "0" : "0 10px";

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const linkClasses = (path) => {
    const baseClasses = `flex items-center py-2 rounded w-full transition-colors duration-100 ease-out ${
      pathname === path ? "text-[#50B848]" : "text-[#1F2937]"
    }`;
    return isCollapsed ? `${baseClasses} justify-center` : `${baseClasses} px-4`;
  };

  const iconClasses = (path) =>
    `${pathname === path ? "text-[#50B848]" : "text-[#A7A9AC]"} ${
      isCollapsed ? "text-2xl" : "text-lg mr-4"
    }`;

  const showTooltip = (event, label) => {
    if (!isCollapsed) return;
    const containerRect = event.currentTarget.getBoundingClientRect();
    const iconElement = event.currentTarget.querySelector("svg");
    const iconRect = iconElement?.getBoundingClientRect();
    setTooltip({
      visible: true,
      label,
      top: iconRect
        ? iconRect.top + iconRect.height / 2
        : containerRect.top + containerRect.height / 2,
      left: iconRect ? iconRect.right + 4 : containerRect.right + 4,
    });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
<div
  className="h-full bg-white fixed shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-gray-900 transition-all duration-150 ease-out flex flex-col overflow-visible"
  style={{
    width: `${sidebarWidth}px`,
    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
    padding: horizontalPadding,
  }}
>

      {/* Title Section */}
      <div className={`${isCollapsed ? "mt-[68px]" : "mt-[60px]"} w-full`}>
        <div className="relative">
          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex items-center justify-center text-[#6B7280] hover:text-[#50B848] transition-colors duration-100 ease-out"
            style={{
              position: "absolute",
              right: isCollapsed ? "-42px" : "-46px",
              top: isCollapsed ? "-60px" : "-56px",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 640 640"
              style={{ 
                fontSize: "30px",
                width: "30px",
                height: "30px",
                transform: isCollapsed ? "scaleX(-1)" : "scaleX(1)",
                transition: "transform 0.15s ease-out"
              }}
            >
              <path 
                fill="currentColor" 
                d="M64 152C64 138.7 74.7 128 88 128C101.3 128 112 138.7 112 152L112 488C112 501.3 101.3 512 88 512C74.7 512 64 501.3 64 488L64 152zM199 337C189.6 327.6 189.6 312.4 199 303.1L335 167C344.4 157.6 359.6 157.6 368.9 167C378.2 176.4 378.3 191.6 368.9 200.9L273.9 295.9L552 295.9C565.3 295.9 576 306.6 576 319.9C576 333.2 565.3 343.9 552 343.9L273.9 343.9L368.9 438.9C378.3 448.3 378.3 463.5 368.9 472.8C359.5 482.1 344.3 482.2 335 472.8L199 337z"
              />
            </svg>
          </button>
          <div
            className={`${isCollapsed ? "w-full flex justify-center" : "w-full text-left"}`}
            style={{
              paddingLeft: isCollapsed ? 0 : "4px",
              paddingRight: isCollapsed ? 0 : "28px",
            }}
          >
            {isCollapsed ? (
              <Image
                src="/images/mvhat.png"
                alt="Graduation cap"
                width={48}
                height={36}
                unoptimized
              />
            ) : (
              <h1 className="text-lg font-bold text-[#4FB748] leading-snug">
                <span style={{ whiteSpace: "nowrap" }}>
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
                          transform: "translateX(-50%)",
                          top: "-14px",
                          width: "28.6px",
                          height: "20.4px",
                          maxWidth: "100px",
                        }}
                        unoptimized
                      />
                    </span>
                    dance
                  </span>{" "}
                  for inheritance
                </span>
                <br />
                <span>and Assets (GIA)</span>
              </h1>
            )}
          </div>
        </div>
        <div
          className={`${isCollapsed ? "mt-6" : "mt-4"}`}
          style={{
            height: "1px",
            backgroundColor: "#E5E5E5",
            marginLeft: isCollapsed ? "0" : "-4px",
            width: isCollapsed ? "100%" : "calc(100% + 4px)",
            opacity: isCollapsed ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>


      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className={`flex flex-col w-full border-none ${isCollapsed ? "mt-8" : "mt-4"}`}>
          <ul className={`space-y-1 w-full border-none ${isCollapsed ? "px-0" : "p-1"}`}>
            <li
              onMouseEnter={(event) => showTooltip(event, "Dashboard")}
              onMouseLeave={hideTooltip}
            >
              <Link href="/dashboard" className={linkClasses("/dashboard")}>
                <FiGrid className={iconClasses("/dashboard")} />
                {!isCollapsed && (
                  <span
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    Dashboard
                  </span>
                )}
              </Link>
            </li>
            <li
              onMouseEnter={(event) => showTooltip(event, "User Profile")}
              onMouseLeave={hideTooltip}
            >
              <Link href="/user-control" className={linkClasses("/user-control")}>
                <FiUserCheck className={iconClasses("/user-control")} />
                {!isCollapsed && (
                  <span
                    style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    User Profile
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className={`mt-auto mb-3 ${isCollapsed ? "px-0" : "px-3"}`}>
        <div 
          className={`flex items-center rounded-lg ${isCollapsed ? "justify-center p-2" : "p-3"}`}
          style={{
            backgroundColor: '#F1F2F2',
            borderRadius: '8px'
          }}
        >
          {/* Avatar */}
          <div 
            className={`flex items-center justify-center rounded-full ${isCollapsed ? "" : "mr-3"}`}
            style={{
              width: isCollapsed ? '40px' : '48px',
              height: isCollapsed ? '40px' : '48px',
              backgroundColor: '#50B848',
              flexShrink: 0
            }}
          >
            <FiUser className="text-white" style={{ fontSize: isCollapsed ? '18px' : '20px' }} />
          </div>
          
          {/* User Info */}
          {!isCollapsed && (
            <div className="flex flex-col">
              <span
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1F2937',
                  lineHeight: '1.2',
                }}
              >
                {userData?.username || 'User'}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  color: '#6B7280',
                  lineHeight: '1.2',
                  marginTop: '2px',
                }}
              >
                {userData?.type ? userData.type.charAt(0).toUpperCase() + userData.type.slice(1) : 'Admin'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Logout at bottom */}
      <div
        className={`pb-4 ${isCollapsed ? "px-0" : "px-3"}`}
        onMouseEnter={(event) => showTooltip(event, "Logout")}
        onMouseLeave={hideTooltip}
      >
        <button
          onClick={handleLogout}
          className={`flex items-center py-3 rounded w-full hover:bg-gray-300 transition-colors duration-100 ease-out ${isCollapsed ? "justify-center" : "px-4"}`}
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: "14px",
            color: "#374151"
          }}
        >
          <FiLogOut className={`${isCollapsed ? "" : "mr-4"} text-lg text-[#A7A9AC]`} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
      {tooltip.visible && (
        <div
          className="pointer-events-none fixed z-50 px-3 py-1 rounded-md text-white text-sm font-medium whitespace-nowrap shadow-lg transition-opacity duration-100"
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            top: `${tooltip.top}px`,
            left: `${tooltip.left}px`,
            transform: "translateY(-50%)",
            backgroundColor: '#4FB848',
          }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
