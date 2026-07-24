import { IconButton, Tooltip } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import SatelliteAltRoundedIcon from "@mui/icons-material/SatelliteAltRounded";
import { useMapContext } from "../providers/MapContext";
import { T } from "../theme/tokens";

const STYLES = [
  {
    url: "mapbox://styles/mapbox/dark-v11",
    label: "Night",
    icon: <DarkModeRoundedIcon fontSize="small" />,
  },
  {
    url: "mapbox://styles/mapbox/streets-v12",
    label: "Streets",
    icon: <MapRoundedIcon fontSize="small" />,
  },
  {
    url: "mapbox://styles/mapbox/satellite-streets-v12",
    label: "Satellite",
    icon: <SatelliteAltRoundedIcon fontSize="small" />,
  },
];

const MapStyleButton = () => {
  const { mapStyle, setMapStyle } = useMapContext();

  const currentIndex = Math.max(
    STYLES.findIndex((s) => s.url === mapStyle),
    0
  );
  const next = STYLES[(currentIndex + 1) % STYLES.length];

  return (
    <Tooltip title={`Switch to ${next.label} view`} arrow>
      <IconButton
        onClick={() => setMapStyle(next.url)}
        sx={{
          position: "absolute",
          zIndex: 1000,
          top: 54,
          right: 10,
          color: T.textHi,
          backgroundColor: `${T.panel}F0`,
          border: `1px solid ${T.line}`,
          borderRadius: "10px",
          "&:hover": { backgroundColor: T.panelSoft, color: T.water },
        }}
      >
        {next.icon}
      </IconButton>
    </Tooltip>
  );
};

export default MapStyleButton;
