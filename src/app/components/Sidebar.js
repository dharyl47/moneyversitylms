"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faNewspaper,
  faUserGear,
  faFileCircleQuestion,
  faRightFromBracket,
  faBars,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove auth status
    router.push("/"); // Redirect to login page
  };

  return (
    <div
      className={`h-full bg-gray-800 fixed text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-48"
      }`}
    >
      <div className="flex flex-col items-center h-full overflow-y-auto">
        <nav className="flex-1 flex flex-col mt-16"> {/* Add spacing for Navbar */}
          <ul className="space-y-2 p-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                {!isCollapsed && "Home"}
              </Link>
            </li>
            <li>
              <Link
                href="/lms"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <FontAwesomeIcon icon={faBook} className="mr-2" />
                {!isCollapsed && "LMS"}
              </Link>
            </li>
            <li>
              <Link
                href="/engagingcontent"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                {!isCollapsed && "Engaging Content"}
              </Link>
            </li>
            <li>
              <Link
                href="/user-control"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <FontAwesomeIcon icon={faUserGear} className="mr-2" />
                {!isCollapsed && "User Profile"}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <FontAwesomeIcon icon={faFileCircleQuestion} className="mr-2" />
                {!isCollapsed && "Privacy Policy"}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className={`flex items-center p-2 rounded hover:bg-gray-700 w-full ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                {!isCollapsed && "Logout"}
              </button>
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
