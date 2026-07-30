import { useGetStats } from "../helpers/API";
import LoadingIcon from "./LoadingIcon";
import { ui } from "../ui/tokens";

const Statistics = () => {
  const { data: stats, loading: loadingStats } = useGetStats();

  if (loadingStats) {
    return (
      <div className="mt-6 flex justify-center">
        <LoadingIcon size={50} />
      </div>
    );
  }

  return (
    <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((item) => (
        <div key={item.name} className={ui.statCard}>
          <dt className="truncate text-sm font-medium text-slate-500">
            {item.name}
          </dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {item.stat}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default Statistics;
