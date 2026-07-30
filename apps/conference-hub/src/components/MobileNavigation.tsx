import React from "react";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { cx, ui } from "../ui/tokens";

const MobileNavigation = ({
  setIsMobileMenuOpen,
}: {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { tabs, selectedTab, setSelectedTab } = useConferenceKioskProvider();

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    setIsMobileMenuOpen(false);
  };

  const handleExternalLink = (href: string) => {
    window.open(href, "_blank");
    setIsMobileMenuOpen(false);
  };

  if (tabs.length === 0) return null;

  return (
    <div className="relative mt-3 sm:hidden">
      <nav
        className={cx(ui.navShell, "absolute right-0 z-50 w-full flex-col")}
        aria-label="Conference sections"
      >
        {tabs.map((tab, index) => {
          const isLast = index === tabs.length - 1;
          const isActive = selectedTab === index;
          return (
            <button
              type="button"
              key={tab.name}
              onClick={() =>
                tab.external ? handleExternalLink(tab.href!) : handleTabChange(index)
              }
              className={cx(
                ui.navItem,
                "w-full text-left",
                isLast
                  ? ui.navItemCta
                  : isActive
                    ? ui.navItemActive
                    : ui.navItemIdle
              )}
              aria-current={!tab.external && isActive ? "page" : undefined}
            >
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavigation;
