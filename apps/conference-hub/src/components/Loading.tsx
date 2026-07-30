const Loading = () => (
  <div className="flex min-h-[50vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-slate-500">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-slate-700"
        aria-hidden
      >
        <path
          className="spinner_Uvk8"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
          transform="translate(12, 12) scale(0)"
        />
        <path
          className="spinner_Uvk8 spinner_ypeD"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
          transform="translate(12, 12) scale(0)"
        />
        <path
          className="spinner_Uvk8 spinner_y0Rj"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
          transform="translate(12, 12) scale(0)"
        />
      </svg>
      <p className="text-sm font-medium">Loading conference…</p>
    </div>
  </div>
);

export default Loading;
