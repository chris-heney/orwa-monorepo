import { Button } from "@mui/material";
import { useMapContext } from "../providers/MapContext";

const ClusterToggleButton = () => {
  const { isClusteredView, toggleClusteredView } = useMapContext();

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={toggleClusteredView}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 900,
        backgroundColor: isClusteredView ? "#3498db" : "#e74c3c",
      }}
    >
      {isClusteredView ? "Application View" : "Cluster View"}
    </Button>
  );
};

export default ClusterToggleButton;