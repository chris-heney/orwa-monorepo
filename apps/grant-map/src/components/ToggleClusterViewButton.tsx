import { Button } from "@mui/material";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import ScatterPlotRoundedIcon from "@mui/icons-material/ScatterPlotRounded";
import { useMapContext } from "../providers/MapContext";
import { T, display } from "../theme/tokens";

const ClusterToggleButton = () => {
  const { isClusteredView, toggleClusteredView } = useMapContext();

  return (
    <Button
      size="small"
      onClick={toggleClusteredView}
      startIcon={
        isClusteredView ? (
          <ScatterPlotRoundedIcon fontSize="small" />
        ) : (
          <BubbleChartRoundedIcon fontSize="small" />
        )
      }
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 900,
        ...display,
        fontWeight: 600,
        textTransform: "none",
        color: T.textHi,
        backgroundColor: `${T.panel}F0`,
        border: `1px solid ${T.line}`,
        borderRadius: "10px",
        px: 1.5,
        "&:hover": { backgroundColor: T.panelSoft, color: T.water },
      }}
    >
      {isClusteredView ? "Application View" : "Cluster View"}
    </Button>
  );
};

export default ClusterToggleButton;
