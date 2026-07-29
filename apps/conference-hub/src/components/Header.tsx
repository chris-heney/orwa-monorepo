import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import ProfileMenu from "./ProfileMenu";

const Header = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}) => {
  const { conference, isLoggedIn, tabs } = useConferenceKioskProvider();

  return (
    <div className="flex items-center justify-between max-w-6xl mx-auto space-y-3 md:space-y-0">
      <div className="flex items-end space-x-4 ">
        <div
          onClick={() => (window.location.href = "https://orwa.org")}
          className="cursor-pointer transition duration-300 transform hover:scale-105"
        >
          <img
            src="./orwa.png"
            alt="ORWA Logo"
            className="h-30 sm:h-16 object-contain"
          />
        </div>

        <div>
          <h1 className="text-white text-2xl md:text-4xl font-bold tracking-wider text-center md:text-left hidden sm:block">
            {conference?.name || "Fall Conference"}
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-10">
        {/* {logoUrl && (
          <img
            src={logoUrl}
            alt="Conference Logo"
            className="h-10 w-auto sm:h-16 object-contain bg-white rounded-lg p-2"
          />
        )} */}
        {isLoggedIn && <ProfileMenu />}
      </div>
      {tabs.length > 0 && <div className="sm:hidden flex justify-end w-full">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>}
    </div>
  );
};

export default Header;
