import { Fragment, useEffect, useState } from "react";
import TournamentRules from "../assets/tournament-rules.jpg?format=webp";
import { useGetContestants } from "../helpers/API";
import { IContestant } from "../types/IContestant";

interface ITeam {
  team: string;
  contestants: IContestant[];
}

const offlineGolfers: ITeam[] = [];

const offlineFishers: ITeam[] = [];

/**
 * Fetch data from API endpoint and transform the data into a format that can be used by the component.
 * @returns
 */
const transformContestants = (
  contestants: IContestant[]
): Record<"f" | "g", ITeam[]> => {
  const roster: any = {
    golfer: [],
    fisher: [],
  };

  // Since the data is flat, and each record is 1 contestant, we need to group it by team
  for (const record of contestants) {
    const contestant: IContestant = {
      first: record.first,
      last: record.last,
      organization: record.organization,
      team: record.team,
      year: record.year,
      type: record.type,
      email: record.email,
      phone: record.phone,
      conference: record.conference,
      conference_ticket: record.conference_ticket,
      items: record.items,
    };
    console.log(contestant);
    const type: string = record.type.toLowerCase();
    const team: string = record.team ? record.team.name : record.organization;
    const teamIndex = roster[type].findIndex((t: any) => t.team === team);
    if (teamIndex === -1) {
      roster[type].push({
        team,
        contestants: [contestant],
      });
    } else {
      roster[type][teamIndex].contestants.push(contestant);
    }
  }

  return {
    f: roster.fisher,
    g: roster.golfer,
  };
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tournament() {
  const [golfers, setGolfers] = useState<ITeam[]>(offlineGolfers);
  const [fishers, setFishers] = useState<ITeam[]>(offlineFishers);
  const [rules, setRules] = useState(false);

  const { data: contestants, loading: isContestantsLoading } = useGetContestants();

  console.log(contestants);
  useEffect(() => {
    if (!isContestantsLoading && contestants) {

      const { g, f } = transformContestants(contestants);
      setGolfers(g);
      setFishers(f);

      console.log(g, f);
    }
  }, [contestants, isContestantsLoading]);

  return (
    <>
      {rules && (
        <div
          id="fishing-rules"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setRules(false)}
          className="fixed top-0 left-0 right-0 z-50 p-4 m-auto overflow-x-hidden overflow-y-auto inset-0 w-full max-h-full flex items-center justify-center bg-black bg-opacity-80"
        >
          <div className="relative w-full max-h-full">
            <div className="relative rounded-lg shadow">
              <img
                src={TournamentRules}
                alt="Tournament Rules"
                className="w-full h-auto rounded-lg m-auto shadow-xl max-w-screen-xl"
              />
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 space-y-3 md:space-y-0 md:space-x-3 text-left">
        <div className="overflow-x-scroll">
          <h3 className="text-2xl lg:text-3xl mb-6 font-bold uppercase">
            Golf Contestants
          </h3>
          <table className="w-full overflow-hidden rounded-lg shadow text-base">
            <thead className="bg-gray-900 text-gray-100">
              <tr>
                <th scope="col" className="p-2 text-left font-semibold">
                  First
                </th>
                <th scope="col" className="p-2 text-left font-semibold">
                  Last
                </th>
                <th scope="col" className="p-2 text-left font-semibold">
                  Organization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {golfers.map((golfer) => (
                <Fragment key={golfer.team}>
                  <tr className="border-gray-200">
                    <th
                      colSpan={5}
                      scope="colgroup"
                      className="tracking-wider uppercase text-sm font-semibold text-black bg-gray-300 px-3 py-1"
                    >
                      Team: {golfer.team}
                    </th>
                  </tr>
                  {golfer.contestants.map(
                    (contestant, contestantIndex: number) => (
                      <tr
                        key={`golfer-${contestantIndex}`}
                        className={classNames(
                          contestantIndex === 0
                            ? "border-gray-300"
                            : "border-gray-200",
                          "border-t"
                        )}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          {contestant.first}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contestant.last}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contestant.organization}
                        </td>
                      </tr>
                    )
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-scroll">
          <div className="flex mb-6">
            <h3 className="text-2xl lg:text-3xl font-bold uppercase">
              Fishing Contestents
            </h3>
            <button
              onClick={() => setRules(true)}
              className="ml-auto text-sm bg-red-500 text-white font-bold px-3 cursor-pointer hover:bg-red-700 rounded-lg"
            >
              See Rules
            </button>
          </div>
          <table className="w-full overflow-hidden rounded-lg shadow text-base">
            <thead className="bg-gray-900 text-gray-100">
              <tr>
                <th scope="col" className="p-2 text-left font-semibold sm:pl-3">
                  First
                </th>
                <th scope="col" className="p-2 text-left font-semibold">
                  Last
                </th>
                <th scope="col" className="p-2 text-left font-semibold">
                  Organization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {fishers.map((fisher) => (
                <Fragment key={fisher.team}>
                  <tr className="border-gray-200">
                    <th
                      colSpan={5}
                      scope="colgroup"
                      className="tracking-wider uppercase text-sm font-semibold text-black bg-gray-300 px-3 py-1"
                    >
                      {fisher.team}
                    </th>
                  </tr>
                  {fisher.contestants.map(
                    (contestant, contestantIndex: number) => (
                      <tr
                        key={`fisher-${contestantIndex}`}
                        className={classNames(
                          contestantIndex === 0
                            ? "border-gray-300"
                            : "border-gray-200",
                          "border-t"
                        )}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          {contestant.first}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contestant.last}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contestant.organization}
                        </td>
                      </tr>
                    )
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
