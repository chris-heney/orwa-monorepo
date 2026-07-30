import { useGetWaterContestants } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import Panel from "../components/Panel";
import { ui, zebraRow } from "../ui/tokens";

interface IWaterContestant {
  first: string;
  last: string;
  organization: string;
  phone: string;
  email: string;
  watersystem: {
    name: string;
  } | null;
  registration: {
    year: number;
  };
  year: number;
  conference: {
    name: string;
  };
}

export default function WaterContestantsShowcase() {
  const { data: waterContestants, loading: isWaterContestantsLoading } =
    useGetWaterContestants();

  return (
    <div className="mx-auto max-w-4xl">
      <Panel
        title="20th Annual Water Taste Test Contestants"
        scroll
        bodyClassName="!p-0"
      >
        {isWaterContestantsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingIcon />
          </div>
        ) : waterContestants?.length > 0 ? (
          (waterContestants as unknown as IWaterContestant[]).map(
            (contestant, i) => (
              <div
                key={`water-contestant-${i}`}
                className={`${zebraRow(i)} flex justify-between gap-3 text-sm`}
              >
                <div className="font-medium text-slate-800">
                  {contestant.first} {contestant.last}
                </div>
                <div className="text-right text-slate-500">
                  {contestant.watersystem?.name || contestant.organization}
                </div>
              </div>
            )
          )
        ) : (
          <p className={ui.empty}>No contestants yet registered.</p>
        )}
      </Panel>
    </div>
  );
}
