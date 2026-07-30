import { useGetSponsors } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import Panel from "../components/Panel";
import { ui, zebraRow } from "../ui/tokens";

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
    <div className="mx-auto max-w-4xl">
      <Panel title="Sponsors" scroll bodyClassName="!p-0">
        {loadingSponsors ? (
          <div className="flex justify-center py-8">
            <LoadingIcon />
          </div>
        ) : groupedSponsorsArray.length > 0 ? (
          groupedSponsorsArray.map((sponsor, i) => (
            <div key={"sponsor-org-" + i} className={zebraRow(i)}>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                {sponsor.organization}
              </h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {sponsor.sponsorships.map((sponsorship, j) => (
                  <li key={"sponsorship-" + i + "-" + j} className="font-medium">
                    {sponsorship.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className={ui.empty}>No sponsors yet registered.</p>
        )}
      </Panel>
    </div>
  );
}
