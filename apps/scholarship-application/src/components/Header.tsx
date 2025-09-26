import { Box } from "@mui/material";
import { useUserContext } from "../providers/UserContextProvider";
import ProfileMenu from "./ProfileMenu";

export const Header = () => {
  const { isLoggedIn } = useUserContext();

  return (
    <header className="bg-gradient-to-r from-gray-900 to-black shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Box className="flex flex-col-reverse md:flex-row justify-between items-center">
          {/* Conference Info Section */}
          <div className="text-center md:text-left">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              ORWEF SCHOLARSHIP
            </h1>
            <p className="text-blue-200 text-sm sm:text-base font-medium mt-1">
              Application Portal
            </p>
          </div>

          {/* Logo and Profile Section */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            {/* Logo */}
            <img 
              src="./orwa.webp" 
              className="max-h-16 sm:max-h-20 object-contain drop-shadow-lg" 
              alt="ORWA Logo" 
            />

            {/* Profile Menu */}
            {isLoggedIn && (
              <div className="flex items-center">
                <ProfileMenu />
              </div>
            )}
          </div>
        </Box>
      </div>
    </header>
  );
};

export default Header;