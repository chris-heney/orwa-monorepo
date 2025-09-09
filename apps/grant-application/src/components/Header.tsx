import { Box } from "@mui/material";
import { useUserContext } from "../providers/UserContextProvider";
import ProfileMenu from "./ProfileMenu";

export const Header = () => {
  const { isLoggedIn } = useUserContext();

  return (
    <header className="bg-black p-3">
      <Box className="max-w-3xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center">
        {/* Conference Info Section */}
        <h5 className="text-white text-xl sm:text-3xl">RURAL INFRASTRUCTURE GRANT</h5>

        {/* Logo and Profile Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img src="./orwa.webp" className="max-h-16 sm:max-h-20 object-contain" alt="ORWA Logo" />

          {/* Profile Menu */}
          {isLoggedIn && (
            <div className="flex items-center">
              <ProfileMenu />
            </div>
          )}
        </div>
      </Box>
    </header>
  );
};

export default Header;