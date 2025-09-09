import { useState, useEffect, useRef } from "react";
import authProvider from "../providers/authProvider";
import { useFormSubmitted, useRegistrationOptions, useUserContext } from "../AppContextProvider";
import { conferenceStatus } from "../types/types";

const ProfileMenu = () => {
  const { ConferenceOptions, setRegistrationOptions } =
    useRegistrationOptions();

    const {setSubmitted} = useFormSubmitted();

  const { setIsLoggedIn, isAdminView, setIsAdminView, setViewingEntries, viewingEntries } = useUserContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For the custom dropdown
  const menuRef = useRef<HTMLDivElement>(null);

  // List of statuses for admin to select
  const statuses = [
    "Online Registration",
    "Online Registration Closed",
    "Kiosk Registration",
    "Coming Soon",
    "Archived",
    "Closed",
  ];

  // Close the menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false); // Close dropdown as well
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

  const handleStatusChange = (newStatus: string) => {
    if (ConferenceOptions) {
      if (setRegistrationOptions) {
        setRegistrationOptions((prev: any) => {
          return {
            ...prev,
            ConferenceOptions: {
              ...prev.ConferenceOptions,
              status: newStatus as conferenceStatus,
            },
          };
        });
      }
    }
    setIsDropdownOpen(false); // Close dropdown after updating status
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
                setSubmitted(false)
              }}
            >
              {viewingEntries ? "Back" : "View Entries"}
            </li>
            <li className="px-4 py-2 relative">
              <span
                className="block font-medium text-gray-700 mb-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Conference Status
                <span
                  className={`ml-2 inline-block transform transition-transform ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </span>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {statuses.map((status) => (
                    <div
                      key={status}
                      className={`px-4 py-2 hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition-all duration-200 ${
                        status === ConferenceOptions?.status
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
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
