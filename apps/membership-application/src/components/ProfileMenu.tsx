import { useState, useRef, useEffect } from "react";
import { useUserContext } from "../providers/MembershipContextProvider";
import authProvider from "../providers/authProvider";
import { useNavigate, useLocation } from "react-router";

const ProfileMenu = () => {
  const { setIsLoggedIn, setIsAdminView, isAdminView } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authProvider.logout();
    setIsLoggedIn(false);
    setIsMenuOpen(false); // Close menu after logout
  };


  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
    setIsMenuOpen(false); // Close menu after selection
  };

  // Function to check if the current route matches the given path
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative text-white bg-gradient-to-tr from-blue-500 to-blue-700 border-2 border-white rounded-full p-2 transition-transform duration-300 hover:scale-110 hover:from-blue-700 hover:to-blue-500 focus:scale-95 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 transition-colors duration-300 hover:stroke-yellow-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14.25c1.795 0 3.25-1.455 3.25-3.25S13.795 7.75 12 7.75s-3.25 1.455-3.25 3.25 1.455 3.25 3.25 3.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 20.25a9.75 9.75 0 0115 0"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg w-60 border border-gray-300 z-50 animate-fade-in">
          <ul className="py-2">
          <li
              className="px-4 py-2 font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition-all duration-200"
              onClick={toggleAdminView}
            >
              {isAdminView ? "Disable Admin View" : "Enable Admin View"}
            </li>
            <li
              className={`px-4 py-2 font-medium ${
                isActiveRoute("/entries")
                  ? "bg-blue-50 text-blue-900"
                  : " hover:bg-blue-50 hover:text-blue-900"
              } cursor-pointer transition-all duration-200`}
              onClick={() => {
                navigate("entries");
                setIsMenuOpen(false); // Close menu after selection
              }}
            >
              View Entries
            </li>
            <li
              className={`px-4 py-2 font-medium ${
                isActiveRoute("/watersystem")
                  ? "bg-blue-50 text-blue-900"
                  : " hover:bg-blue-50 hover:text-blue-900"
              } cursor-pointer transition-all duration-200`}
              onClick={() => {
                navigate("watersystem");
                setIsMenuOpen(false); // Close menu after selection
              }}
            >
              Watersystem Membership
            </li>
            <li
              className={`px-4 py-2 font-medium ${
                isActiveRoute("/watersystem-renewal")
                  ? "bg-blue-50 text-blue-900"
                  : " hover:bg-blue-50 hover:text-blue-900"
              } cursor-pointer transition-all duration-200`}
              onClick={() => {
                navigate("watersystem-renewal");
                setIsMenuOpen(false); // Close menu after selection
              }}
            >
              Watersystem Renewal
            </li>
            <li
              className={`px-4 py-2 font-medium ${
                isActiveRoute("/associate")
                  ? "bg-blue-50 text-blue-900"
                  : " hover:bg-blue-50 hover:text-blue-900"
              } cursor-pointer transition-all duration-200`}
              onClick={() => {
                navigate("associate");
                setIsMenuOpen(false); // Close menu after selection
              }}
            >
              Associate Membership
            </li>
            <li
              className={`px-4 py-2 font-medium ${
                isActiveRoute("/associate-renewal")
                  ? "bg-blue-50 text-blue-900"
                  : " hover:bg-blue-50 hover:text-blue-900"
              } cursor-pointer transition-all duration-200`}
              onClick={() => {
                navigate("associate-renewal");
                setIsMenuOpen(false); // Close menu after selection
              }}
            >
              Associate Renewal
            </li>
            <li
              className="px-4 py-2 font-medium text-red-600 hover:bg-red-50 hover:text-red-800 cursor-pointer transition-all duration-200"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;