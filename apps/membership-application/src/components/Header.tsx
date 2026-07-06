import { Box } from "@mui/material";
import { useUserContext } from "../providers/MembershipContextProvider";
import ProfileMenu from "./ProfileMenu";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation

export const Header = () => {
  const location = useLocation(); // Get the current location object
  const [title, setTitle] = useState<string>(
    location.pathname.replace("/", "")
      .replace("&admin", "")
      .replace(/-/g, " ")
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ")
  );

  const { isLoggedIn } = useUserContext();

  useEffect(() => {
    // Update the title whenever the location changes
    setTitle(
      location.pathname.replace("/", "")
        .replace("&admin", "")
        .replace(/-/g, " ")
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ")
    );
  }, [location.pathname]); // React to changes in the pathname

  return (
    <header className="bg-black p-3">
      <Box className="max-w-3xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h5 className="text-white text-xl sm:text-3xl">
            {title.startsWith("Water") && title.includes("renewal")
              ? "System Renewal"
              : title}{" "}
            Membership Form
          </h5>
        </div>
        <div className="flex items-center justify-center gap-6">
          <img src="./orwa.webp" className="max-h-16 sm:max-h-116" />
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
