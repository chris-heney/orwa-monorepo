interface CardSvgProps {
  active: boolean;
}

/** Clean credit-card icon (stroke) — replaces the old multi-layer bitmap SVG. */
const CardSVG = ({ active }: CardSvgProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className="h-full w-full"
  >
    <rect
      x="2.75"
      y="5.75"
      width="18.5"
      height="12.5"
      rx="2"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
    />
    <path
      d="M2.75 10h18.5"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
    />
    <path
      d="M6.5 15h4"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default CardSVG;
