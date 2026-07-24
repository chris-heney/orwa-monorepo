interface FishSVGProps {
  active?: boolean;
}

const FishSVG = ({ active }: FishSVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill={active ? "#2563eb" : "#94a3b8"}
  >
    <path d="M14 50c0-3 12-22 38-22 18 0 30 12 34 18l10-12c1.5-1.8 4.5-.5 4 2l-3 14 3 14c.5 2.5-2.5 3.8-4 2L86 54c-4 6-16 18-34 18C26 72 14 53 14 50Zm52-8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
    <path d="M38 34c-6-6-16-8-22-8 2 5 5 10 10 13 4-2 8-4 12-5ZM38 66c-6 6-16 8-22 8 2-5 5-10 10-13 4 2 8 4 12 5Z" />
  </svg>
);

export default FishSVG;
