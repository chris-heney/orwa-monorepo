import { useState, useEffect, useRef } from "react";
import authProvider from "../providers/authProvider";
import { useFormSubmittedContext } from "../providers/AppContextProvider";
import { useUserContext } from "../providers/UserContextProvider";

const ProfileMenu = () => {

    const {setIsFormSubmitted} = useFormSubmittedContext();

  const { setIsLoggedIn, isAdminView, setIsAdminView, setViewingEntries, viewingEntries } = useUserContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
 

  // Close the menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    authProvider.logout();
    setIsLoggedIn(false);
    setIsMenuOpen(false); // Close menu after logout
  };

  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
    setIsMenuOpen(false); // Close menu after selection
  };

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
              className="px-4 py-2 font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition-all duration-200"
              onClick={() => {
                setViewingEntries(!viewingEntries)
                setIsFormSubmitted(false)
              }}
            >
              {viewingEntries ? "Back" : "View Entries"}
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
