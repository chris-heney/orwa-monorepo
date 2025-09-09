import React, { useContext } from "react";
import { TicketIndex } from "../../AppContextProvider";

interface CustomHeaderProps {
  title: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomSecondaryHeader: React.FC<CustomHeaderProps> = ({
  title,
  setIsOpen,
}) => {
  const { setTicketIndex } = useContext(TicketIndex);

  return (
    <div className="flex items-center w-full bg-black border-b border-slate-500 justify-between px-4 py-2">
      <h2 className="text-white text-lg font-semibold">{title}</h2>
      {/* Close Button */}
      <button
        onClick={() => {
          setIsOpen(false);
          setTicketIndex(-1);
        }}
        className="text-white hover:text-gray-400 text-lg p-2"
      >
        X
      </button>
    </div>
  );
};

export default CustomSecondaryHeader;