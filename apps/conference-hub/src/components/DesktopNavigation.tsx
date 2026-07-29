import React from "react";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";

const DesktopNavigation = ({
  setIsMobileMenuOpen,
}: {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { tabs, selectedTab, setSelectedTab } = useConferenceKioskProvider();

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    setIsMobileMenuOpen(false); // Close mobile menu when a tab is clicked
  };

  const handleExternalLink = (href: string) => {
    window.open(href, "_blank");
    setIsMobileMenuOpen(false); // Close mobile menu when an external link is clicked
  };

  return tabs.length > 0 && (
    <div className="hidden sm:block mt-5 max-w-6xl mx-auto">
      <nav className="flex justify-between space-x-2 bg-white rounded-md shadow-lg p-2">
        {tabs.map((tab, index) => (
          <a
            key={tab.name}
            onClick={() =>
              tab.external
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ? handleExternalLink(tab.href!)
                : handleTabChange(index)
            }
            className={classNames(
              index === tabs.length - 1
                ? "bg-green-500 text-white font-bold"
                : selectedTab === index
                ? "bg-blue-500 text-white font-bold"
                : "text-gray-700 hover:bg-indigo-100 hover:text-blue-600",
              "transition duration-200 ease-in-out px-4 py-2 rounded-lg cursor-pointer"
            )}
            aria-current={selectedTab === index ? "page" : undefined}
          >
            {tab.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default DesktopNavigation;
