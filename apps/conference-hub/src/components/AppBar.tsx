import { useState } from "react";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";

const AppBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-zinc-950 to-black p-5 w-full shadow-md">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      {/* Desktop Navigation */}
      <DesktopNavigation setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <MobileNavigation setIsMobileMenuOpen={setIsMobileMenuOpen} />
      )}
    </header>
  );
};

export default AppBar;
