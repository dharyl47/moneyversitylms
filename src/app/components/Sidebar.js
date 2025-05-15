"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserGear,
  faFileCircleQuestion,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname(); // Correct way to get current path

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  const linkClasses = (path) =>
    `flex items-center p-2 rounded w-full transition-colors duration-200 ${
      pathname === path ? "bg-[#3C8DBC] text-white" : "hover:bg-gray-300 text-gray-900"
    } font-sans`;

  return (
<div
  className="h-full bg-white fixed shadow-[0_4px_15px_rgba(0,0,0,0.6)] text-gray-900 transition-all duration-300"
  style={{
    width: "250px", // Set any pixel width you want
    fontFamily:
      'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol',
    fontSize: "15px",
  }}
>


      <div className="flex flex-col items-center h-full overflow-y-auto">
        <nav className="flex-1 flex flex-col mt-16 w-full">
          <ul className="space-y-1 p-1 w-full">
            <li>
              <Link href="/dashboard" className={linkClasses("/dashboard")}>
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/user-control" className={linkClasses("/user-control")}>
                <FontAwesomeIcon icon={faUserGear} className="mr-2" />
                User Profile
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className={linkClasses("/privacy-policy")}>
                <FontAwesomeIcon icon={faFileCircleQuestion} className="mr-2" />
                Privacy Policy
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-3 rounded w-full hover:bg-gray-300 font-sans transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
