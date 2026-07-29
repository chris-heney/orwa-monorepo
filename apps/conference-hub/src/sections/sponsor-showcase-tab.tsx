import { motion } from "framer-motion";
import { useGetSponsors } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import TitleBar from "../components/titlebar";

interface Sponsorship {
  name: string;
}

interface GroupedSponsor {
  organization: string;
  sponsorships: Sponsorship[];
}

export default function SponsorShowcaseTab() {
  const { data: sponsors, loading: loadingSponsors } = useGetSponsors();

  const groupedSponsors = sponsors
    ? sponsors.reduce<Record<string, GroupedSponsor>>((acc, sponsor) => {
        const org = sponsor.registration
          ? sponsor.registration.organization
          : sponsor.organization
            ? sponsor.organization
            : "Anonymous";
        if (!acc[org]) {
          acc[org] = { organization: org, sponsorships: [] };
        }
        acc[org].sponsorships.push(
          ...(sponsor.sponsorships ?? []).map((s) => ({ name: s.name }))
        );
        return acc;
      }, {})
    : {};

  const groupedSponsorsArray = Object.values(groupedSponsors);

  return (
    <div className="px-4">
      <motion.div
        className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="sticky -top-4">
          <TitleBar>Sponsors</TitleBar>
        </div>
        <div className="text-sm">
          {loadingSponsors ? (
            <LoadingIcon />
          ) : groupedSponsorsArray?.length > 0 ? (
            groupedSponsorsArray.map((sponsor, i) => (
              <motion.div
                key={"sponsor-org-" + i}
                className={
                  "-mx-4 px-4 py-3 bg-gray-" + (i % 2 === 0 ? "100" : "300")
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <h3 className="text-xl text-gray-700 font-bold mb-2">
                  {sponsor.organization}
                </h3>
                {sponsor.sponsorships.map((sponsorship, j) => (
                  <motion.div
                    className="my-2"
                    key={"sponsorship-" + i + "-" + j}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: j * 0.1, duration: 0.5 }}
                  >
                    <p className="font-bold">{sponsorship.name}</p>
                  </motion.div>
                ))}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 font-medium mt-6">
              No sponsors yet registered.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
