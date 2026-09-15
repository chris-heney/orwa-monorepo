import Countdown from "./Countdown";

interface EarlyRegistrationDiscountProps {
  /**
   * First day of event pricing (YYYY-MM-DD) — the day after
   * `online_registration_end`, so the countdown runs through the last early day.
   */
  endsOn: string;
}

const EarlyRegistrationDiscount = ({
  endsOn,
}: EarlyRegistrationDiscountProps) => {
  return (
    <Countdown
      targetDate={endsOn}
      subtitle="Early registration"
      title="Discount ends in"
    />
  );
};

export default EarlyRegistrationDiscount;
