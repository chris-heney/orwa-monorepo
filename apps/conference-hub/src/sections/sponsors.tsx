import Marquee from "react-fast-marquee";
import { useGetSponsors } from "../helpers/API";
import { ISponsor } from "../types/ISponsor";
import Loading from "../components/Loading";

export default function Sponsors() {
  const { data: sponsors, loading: isSponsorsLoading } = useGetSponsors();

  if (isSponsorsLoading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <Loading />
      </div>
    );
  }

  const logos = sponsors.filter((sponsor) => sponsor.logo);

  if (logos.length === 0) return null;

  return (
    <Marquee gradient gradientColor="#ffffff" gradientWidth={48} speed={40}>
      {logos.map((sponsor: ISponsor, index: number) => (
        <div
          key={`sponsor-${index}`}
          className="mx-5 flex h-24 w-40 items-center justify-center"
        >
          <img
            src={
              import.meta.env.VITE_API_ENDPOINT.replace("/api", "") +
              sponsor.logo!.url
            }
            alt="Sponsor Logo"
            className="max-h-16 max-w-full object-contain"
          />
        </div>
      ))}
    </Marquee>
  );
}
