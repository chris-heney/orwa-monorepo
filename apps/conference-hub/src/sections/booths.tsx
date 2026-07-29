import { motion } from "framer-motion";
import { useGetBooths } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import TitleBar from "../components/titlebar";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { Download } from "@mui/icons-material";

export default function Booths() {
  const { data: booths, loading: loadingBooths } = useGetBooths();
  const { conference } = useConferenceKioskProvider();
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const boothMapUrl = conference?.booth_map?.url
    ? `${API_ENDPOINT.replace("/api", "")}${conference.booth_map.url}`
    : null;

  const downloadMap = async () => {
    if (boothMapUrl) {
      try {
        const response = await fetch(boothMapUrl, { mode: "cors" });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${conference?.name ?? "conference"}-booth-map.png`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading the map:", error);
      }
    }
  };

  return (
    <div className="px-4">
      <div className="text-left max-w-4xl mx-auto">
        <motion.div
          className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="sticky -top-4">
            <TitleBar>Vendor Booths</TitleBar>
          </div>
          <div className="text-sm">
            {loadingBooths ? (
              <LoadingIcon />
            ) : booths?.length > 0 ? (
              booths.map((booth, i) => (
                <motion.div
                  key={`booth-${booth.id}`}
                  className={
                    "flex -mx-4 px-4 py-3 bg-gray-" +
                    (i % 2 === 0 ? "100" : "300")
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  {/* {booth.booth_number && (
                    <div className={`mr-2 w-12`}>{booth.booth_number}</div>
                  )} */}
                  <div className={`pl-2 text-ellipsis`}>
                    {booth.organization}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 font-medium mt-6">
                No booths yet registered.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {boothMapUrl && (
        <motion.div
          className="p-4 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <TitleBar>
            <div className="flex justify-between items-center">
              Booths Map
              <button
                className="bg-blue-500 text-white font-bold px-2 py-1 rounded-lg ml-2"
                onClick={downloadMap}
              >
                Download
                <Download className="ml-1" />
              </button>
            </div>
          </TitleBar>
          <div className="bg-white -mx-4">
            <img
              src={boothMapUrl}
              alt="Booth Map"
              className="mx-auto cursor-pointer"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
