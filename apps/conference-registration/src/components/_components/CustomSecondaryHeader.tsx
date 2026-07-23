import React, { useContext } from "react";
import { TicketIndex } from "../../AppContextProvider";

interface CustomHeaderProps {
  title: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
}

const CustomSecondaryHeader: React.FC<CustomHeaderProps> = ({
  title,
  setIsOpen,
}) => {
  const { setTicketIndex } = useContext(TicketIndex);

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-800 px-5 py-3.5">
      <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
        {title}
      </h2>
      <button
        type="button"
        onClick={() => {
          // Supports both boolean dispatchers and close callbacks used by modals.
          (setIsOpen as (value?: boolean) => void)(false);
          setTicketIndex(-1);
        }}
        className="rounded-md p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Close"
        title="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
};

export default CustomSecondaryHeader;
