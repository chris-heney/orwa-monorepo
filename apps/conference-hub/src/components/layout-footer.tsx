export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center gap-2 text-sm text-slate-500 md:flex-row md:justify-between">
      <span>&copy; {year} Oklahoma Rural Water Association</span>
      <span>
        Powered by{" "}
        <a
          href="https://www.ruralwaterimpact.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          RWI
        </a>
      </span>
    </div>
  );
}
