const Loading = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <svg
        className="animate-spin text-blue-500"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          className="opacity-75"
        />
      </svg>
    </div>
  );
  
  export default Loading;