import { useGetStats } from '../helpers/API';
import LoadingIcon from './LoadingIcon';

const Statistics = () => {
  const { data: stats, loading: loadingStats } = useGetStats();

  return (
    <div>
      {loadingStats ? (
        <div className="mt-6">
          <LoadingIcon size={50} />
        </div>
      ) : (
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-gray-300 px-4 py-5 shadow-md sm:p-6 shadow-gray-300"
            >
              <dt className="truncate text-sm font-bold text-black">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-black">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};

export default Statistics;