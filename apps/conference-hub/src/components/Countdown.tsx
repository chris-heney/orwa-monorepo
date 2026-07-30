import { useEffect, useState } from "react";
import { parseConferenceDate } from "../helpers/parseConferenceDate";
import { ui } from "../ui/tokens";

type CountdownProps = {
  targetDate: string;
  title: string;
  subtitle?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const zero: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({
  targetDate,
  title,
  subtitle,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(zero);

  useEffect(() => {
    const tick = () => {
      const difference =
        parseConferenceDate(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft(zero);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units: Array<[string, number]> = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Mins", timeLeft.minutes],
    ["Secs", timeLeft.seconds],
  ];

  return (
    <div className={ui.countdownShell}>
      <p className={ui.subheading}>{subtitle}</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 flex justify-center gap-2 sm:gap-3">
        {units.map(([label, value]) => (
          <div key={label} className={ui.countdownUnit}>
            <p className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
              {pad(value)}
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-300">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
