import { useUserContext } from "../AppContextProvider";

/** Discreet persistent banner when `&test` unlocks public registration. */
const TestModeBanner = () => {
  const { isTestMode } = useUserContext();
  if (!isTestMode) return null;

  return (
    <div
      role="status"
      className="bg-amber-100 text-amber-950 border-b border-amber-300 px-3 py-2 text-center text-sm font-medium"
    >
      Test mode — sandbox payment
    </div>
  );
};

export default TestModeBanner;
