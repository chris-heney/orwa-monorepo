import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import Countdown from "./Countdown";

const ConferenceBeginsIn = () => {
  const { conference } = useConferenceKioskProvider();

  return (
    <Countdown
      targetDate={conference.start_date}
      subtitle={conference.name}
      title="Conference begins in"
    />
  );
};

export default ConferenceBeginsIn;
