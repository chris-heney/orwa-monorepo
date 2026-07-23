import { useRegistrationOptions } from "../AppContextProvider";
import { ticketMatchesContext } from "../helpers/ticketMatchesContext";
import StepContestants from "./StepContestants";
import StepWaterContestant from "./StepWaterContestant";

/**
 * Fall Conference: Golfer / Fisher tickets → StepContestants.
 * Annual Conference: Water Taste Test registration addons → StepWaterContestant.
 * A conference can expose either or both.
 */
const StepContestantRegistration = () => {
  const { TicketOptions, RegistrationAddons } = useRegistrationOptions();

  const hasContestantTickets = TicketOptions.some((ticket) =>
    ticketMatchesContext(ticket, "Contestant")
  );
  const hasContestantAddons = RegistrationAddons.some(
    (addon) => addon.context === "Contestant"
  );

  if (!hasContestantTickets && !hasContestantAddons) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 text-center text-sm text-slate-500">
        No contestant registration options are available for this conference.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {hasContestantTickets && <StepContestants />}
      {hasContestantAddons && <StepWaterContestant />}
    </div>
  );
};

export default StepContestantRegistration;
