import { Box } from "@mui/material";
import { RegistrationOptions, useUserContext } from "../AppContextProvider";
import { useContext } from "react";
import ProfileMenu from "./ProfileMenu";

export const Header = () => {
  const { ConferenceOptions } = useContext(RegistrationOptions);
  const { isLoggedIn } = useUserContext();

  return (
    <header className="bg-black p-3">
      <Box className="max-w-3xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center">
        {/* Conference Info Section */}
        <div className="text-center md:text-left">
          <h5 className="text-white text-xl sm:text-3xl">
            Conference Registration
          </h5>
          <h6 className="text-white font-semibold">{ConferenceOptions.name}</h6>
        </div>

        {/* Logo and Profile Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img src="./orwa.png" className="max-h-16 sm:max-h-20 object-contain" alt="ORWA Logo" />

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