interface SponsorSvgProps {
  active: boolean;
}

/** Award-ribbon icon representing conference sponsorship. */
const SponsorSVG = ({ active }: SponsorSvgProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className="h-full w-full"
  >
    <circle
      cx="12"
      cy="8.25"
      r="5"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
    />
    <path
      d="M9 12.75 6.25 21.25 12 18.25l5.75 3-2.75-8.5"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9.75 8.25 11.25 9.75 14.5 6.5"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SponsorSVG;
