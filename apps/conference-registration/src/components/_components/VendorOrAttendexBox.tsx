import BoothSvg from "./BoothSvg";
import AttendeeSVG from "./AttendeeSVG";
import FishSVG from "./FishSVG";
import SponsorSVG from "./SponsorSVG";

interface ApprovalProps {
  registrationType: "Vendor" | "Attendee" | "Contestant" | "Sponsor";
  checked: "Vendor" | "Attendee" | "Contestant" | "Sponsor" | null;
  setRegistrationType: () => void;
  /** Optional display label (e.g. "Contestant Only"); defaults to the type. */
  label?: string;
  description?: string;
}

const DESCRIPTIONS: Record<ApprovalProps["registrationType"], string> = {
  Attendee:
    "Register people attending sessions and events, and optionally participate as contestants and/or sponsor the conference.",
  Vendor:
    "Reserve booth space, register vendor reps, and optionally participate as contestants and/or sponsor the conference.",
  Contestant: "For Golf or Bass Tournament Participants",
  Sponsor:
    "Sponsor the conference without registering attendees, vendors, or contestants.",
};

const VendorOrAttendeeBox = ({
  registrationType,
  checked,
  setRegistrationType,
  label,
  description: descriptionProp,
}: ApprovalProps) => {
  const isSelected = checked === registrationType;
  const description = descriptionProp ?? DESCRIPTIONS[registrationType];

  return (
    <button
      type="button"
      onClick={setRegistrationType}
      aria-pressed={isSelected}
      className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isSelected
          ? "border-blue-600 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
          isSelected ? "bg-blue-100" : "bg-slate-100 group-hover:bg-slate-200/80"
        }`}
      >
        <div className="h-9 w-9">
          {registrationType === "Vendor" ? (
            <BoothSvg active={isSelected} />
          ) : registrationType === "Contestant" ? (
            <FishSVG active={isSelected} />
          ) : registrationType === "Sponsor" ? (
            <SponsorSVG active={isSelected} />
          ) : (
            <AttendeeSVG active={isSelected} />
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <span
          className={`block text-base font-bold ${
            isSelected ? "text-blue-700" : "text-slate-800"
          }`}
        >
          {label ?? registrationType}
        </span>
        <span
          className={`mt-0.5 block text-xs leading-snug ${
            registrationType === "Contestant" ? "italic" : ""
          } ${isSelected ? "text-blue-700/80" : "text-slate-500"}`}
        >
          {description}
        </span>
      </div>
      {isSelected && (
        <span className="ml-2 inline-flex shrink-0 items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          Selected
        </span>
      )}
    </button>
  );
};

export default VendorOrAttendeeBox;
