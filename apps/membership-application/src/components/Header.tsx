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
    <header className="bg-black px-4 py-3">
      <Box className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-2 md:flex-row">
        <div className="text-center md:text-left">
          <h1 className="text-lg font-semibold tracking-tight text-white sm:text-2xl">
            {title.startsWith("Water") && title.includes("renewal")
              ? "System Renewal"
              : title}{" "}
            Membership Form
          </h1>
        </div>
        <div className="flex items-center justify-center gap-6">
          <img src="./orwa.webp" alt="ORWA" className="h-12 w-auto sm:h-14" />
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
