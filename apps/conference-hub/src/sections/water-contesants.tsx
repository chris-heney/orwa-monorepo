import { useGetWaterContestants } from "../helpers/API";
import { motion } from "framer-motion";
import LoadingIcon from "../components/LoadingIcon";
import TitleBar from "../components/titlebar";

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
  const { data: waterContestants, loading: isWaterContestantsLoading } = useGetWaterContestants();

  return (
    <div className="px-4">
      <motion.div
        className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="sticky -top-4">
          <TitleBar>20th Annual Water Taste Test Contestants</TitleBar>
        </div>
        <div className="text-sm">
          {isWaterContestantsLoading ? (
            <LoadingIcon />
          ) : waterContestants?.length > 0 ? (
            (waterContestants as unknown as IWaterContestant[]).map((contestant, i) => (
              <motion.div
                key={`water-contestant-${i}`}
                className={
                  "flex -mx-4 px-4 py-3 bg-gray-" + (i % 2 === 0 ? "100" : "300")
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="mr-4">
                  <h4 className="text-md font-semibold text-left">
                    {contestant.first} {contestant.last}
                  </h4>
                  <p className="text-sm">
                    <strong>System:</strong> {contestant.watersystem?.name}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 font-medium mt-6">
              No contestant yet registered.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}