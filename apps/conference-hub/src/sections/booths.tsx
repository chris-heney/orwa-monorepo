import { useGetBooths } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import Panel from "../components/Panel";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { Download } from "@mui/icons-material";
import { ui, zebraRow } from "../ui/tokens";

export default function Booths() {
  const { data: booths, loading: loadingBooths } = useGetBooths();
  const { conference } = useConferenceKioskProvider();
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const boothMapUrl = conference?.booth_map?.url
    ? `${API_ENDPOINT.replace("/api", "")}${conference.booth_map.url}`
    : null;

  const downloadMap = async () => {
    if (!boothMapUrl) return;
    try {
      const response = await fetch(boothMapUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${conference?.name ?? "conference"}-booth-map.png`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the map:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Panel title="Vendor Booths" scroll bodyClassName="!p-0">
        {loadingBooths ? (
          <div className="flex justify-center py-8">
            <LoadingIcon />
          </div>
        ) : booths?.length > 0 ? (
          booths.map((booth, i) => (
            <div key={`booth-${booth.id}`} className={`${zebraRow(i)} text-sm`}>
              <div className="font-medium text-slate-800">
                {booth.organization}
              </div>
            </div>
          ))
        ) : (
          <p className={ui.empty}>No booths yet registered.</p>
        )}
      </Panel>

      {boothMapUrl && (
        <Panel
          title={
            <>
              <span>Booths Map</span>
              <button type="button" className={ui.btnPrimary} onClick={downloadMap}>
                Download
                <Download fontSize="small" />
              </button>
            </>
          }
          bodyClassName="!p-0"
        >
          <img
            src={boothMapUrl}
            alt="Booth Map"
            className="mx-auto w-full cursor-pointer object-contain"
          />
        </Panel>
      )}
    </div>
  );
}
