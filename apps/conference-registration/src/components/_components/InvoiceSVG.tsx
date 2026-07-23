interface InvoiceSvgProps {
  active: boolean;
}

/** Clean invoice/document icon (stroke) — replaces the pixelated green invoice art. */
const InvoiceSVG = ({ active }: InvoiceSvgProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className="h-full w-full"
  >
    <path
      d="M14 2.75H7.5A1.75 1.75 0 0 0 5.75 4.5v15A1.75 1.75 0 0 0 7.5 21.25h9A1.75 1.75 0 0 0 18.25 19.5V7L14 2.75Z"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 2.75V7h4.25"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 12.5h7M8.5 16h4.5"
      stroke={active ? "#2563eb" : "#94a3b8"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default InvoiceSVG;
