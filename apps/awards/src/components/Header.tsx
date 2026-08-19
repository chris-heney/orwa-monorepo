import { useUserContext } from "../providers/UserContextProvider";
import ProfileMenu from "./ProfileMenu";

export const Header = () => {
  const { isLoggedIn, isAdminView } = useUserContext();

  return (
    <header className="bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          {/* Brand copy — block stack; order-2 so logo sits above on mobile */}
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start gap-0.5 text-center md:text-left">
            <h1 className="block m-0 text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              ORWA AWARDS
            </h1>
            <p className="block m-0 text-blue-200 text-sm sm:text-base font-medium leading-snug">
              Nomination Portal
            </p>
          </div>

          <div className="order-1 md:order-2 flex items-center justify-center gap-4 shrink-0">
            <img
              src="./orwa.png"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              alt="ORWA Logo"
            />
            {isLoggedIn && (
              <div className="flex items-center gap-3">
                {isAdminView && (
                  <span className="rounded-full border border-amber-300 bg-amber-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
                    Admin View
                  </span>
                )}
                <ProfileMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
