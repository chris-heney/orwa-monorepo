import Marquee from "react-fast-marquee";
import { useGetSponsors } from "../helpers/API";
import { ISponsor } from "../types/ISponsor";
import Loading from "../components/Loading";

export default function Sponsors() {
  const { data: sponsors, loading: isSponsorsLoading } = useGetSponsors();

  if (isSponsorsLoading) {
    return <Loading />;
  }

  return (
    <Marquee gradient={false} direction="left" speed={50}>
      {sponsors
        .filter((sponsor) => {
          return sponsor.logo;
        })
        .map((sponsor: ISponsor, index: number) => (
          <div
            key={`sponsor-${index}`}
            className="flex justify-center items-center mx-4"
            style={{
              height: "200px",
              width: "250px",
              overflow: "hidden",
            }}
          >
            <img
              src={
                import.meta.env.VITE_API_ENDPOINT.replace("/api", "") +
                sponsor.logo!.url
              }
              alt="Sponsor Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
    </Marquee>
  );
}
