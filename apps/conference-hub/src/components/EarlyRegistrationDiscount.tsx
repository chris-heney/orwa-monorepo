import React, { useEffect, useState } from "react";
import { parseConferenceDate } from "../helpers/parseConferenceDate";

interface EarlyRegistrationDiscountProps {
  startDate: string; // Conference start date
}

const EarlyRegistrationDiscount: React.FC<EarlyRegistrationDiscountProps> = ({ startDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const conferenceStart = parseConferenceDate(startDate);
      const difference = conferenceStart.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Early Registration Discount</h1>
      <h2 className="text-2xl text-blue-500 font-bold mt-2 relative">
        Expires
        <span className="absolute left-0 right-0 mx-auto w-20 h-1 bg-red-500 animate-pulse-line"></span>
      </h2>
      <h2 className="text-6xl font-bold mt-2">IN</h2>
      <div className="flex justify-center mt-4 gap-2 md:gap-4">
        <div className="text-white bg-black px-4 py-2 rounded-lg">
          <p className="text-4xl">{String(timeLeft.days).padStart(2, "0")}</p>
          <p className="text-lg">Days</p>
        </div>
        <div className="text-white bg-black px-4 py-2 rounded-lg">
          <p className="text-4xl">{String(timeLeft.hours).padStart(2, "0")}</p>
          <p className="text-lg">Hours</p>
        </div>
        <div className="text-white bg-black px-4 py-2 rounded-lg">
          <p className="text-4xl">{String(timeLeft.minutes).padStart(2, "0")}</p>
          <p className="text-lg">Minutes</p>
        </div>
        <div className="text-white bg-black px-4 py-2 rounded-lg">
          <p className="text-4xl">{String(timeLeft.seconds).padStart(2, "0")}</p>
          <p className="text-lg">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default EarlyRegistrationDiscount;