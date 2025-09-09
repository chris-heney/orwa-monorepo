import { IconButton, Tooltip } from "@mui/material";
import StreetviewIcon from "@mui/icons-material/Streetview";
import SatelliteIcon from "@mui/icons-material/Satellite";
import { useMapContext } from "../providers/MapContext";

const MapStyleButton = () => {
  const { mapStyle, setMapStyle } = useMapContext();

  const toggleMapStyle = () => {
    setMapStyle((prevStyle) =>
      prevStyle === "mapbox://styles/mapbox/streets-v9"
        ? "mapbox://styles/mapbox/satellite-streets-v11"
        : "mapbox://styles/mapbox/streets-v9"
    );
  };

  return (
    <Tooltip
      title={mapStyle === "mapbox://styles/mapbox/streets-v9" ? "Satellite View" : "Street View"}
      arrow
    >
      <IconButton
        onClick={toggleMapStyle}
        sx={{ position: "absolute", zIndex: 1000, top: 50, right: 10 }}
        color="primary"
      >
        {mapStyle === "mapbox://styles/mapbox/streets-v9" ? (
          <SatelliteIcon />
        ) : (
          <StreetviewIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default MapStyleButton;