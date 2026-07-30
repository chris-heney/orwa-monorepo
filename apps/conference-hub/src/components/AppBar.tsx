import { useState } from "react";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";

const AppBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-sm">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <DesktopNavigation setIsMobileMenuOpen={setIsMobileMenuOpen} />
        {isMobileMenuOpen && (
          <MobileNavigation setIsMobileMenuOpen={setIsMobileMenuOpen} />
        )}
      </div>
    </header>
  );
};

export default AppBar;
