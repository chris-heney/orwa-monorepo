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
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <a
          href="https://orwa.org"
          className="shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <img
            src="./orwa.png"
            alt="ORWA Logo"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </a>
        <div className="min-w-0 hidden sm:block">
          <p className="truncate text-lg font-semibold tracking-tight text-white sm:text-2xl">
            {conference?.name || "Fall Conference"}
          </p>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Conference Hub
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn && <ProfileMenu />}
        {tabs.length > 0 && (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-2 text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
