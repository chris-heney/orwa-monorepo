import Countdown from "./Countdown";

interface EarlyRegistrationDiscountProps {
  startDate: string;
}

const EarlyRegistrationDiscount = ({
  startDate,
}: EarlyRegistrationDiscountProps) => {
  return (
    <Countdown
      targetDate={startDate}
      subtitle="Early registration"
      title="Discount ends in"
    />
  );
};

export default EarlyRegistrationDiscount;
