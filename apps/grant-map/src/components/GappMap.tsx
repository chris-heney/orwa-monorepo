import Map, { ViewStateChangeEvent } from "react-map-gl/mapbox"
import { useCallback } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import GAppLayer from "./GAppLayer"
import ToggleClusterViewButton from "./ToggleClusterViewButton"
import { useAppContext } from "../providers/AppContext"
import { useMapContext } from "../providers/MapContext"
import MapStyleButton from "./MapStyleButton"
import { Box } from "@mui/material"
import CountyChoroplethLayer from "./CountyChoroplethLayer"
import MapLegend from "./MapLegend"
import MetricsBand from "./insights/MetricsBand"
import { T } from "../theme/tokens"


const GappMap = () => {

  const { mapState, setMapState } = useAppContext()
  const { mapRef, mapStyle } = useMapContext()

  const onMove = useCallback(
    ({ viewState: newMapState }: ViewStateChangeEvent) => {
      setMapState(newMapState)
      // localStorage.setItem("mapState", JSON.stringify(newMapState))

    },
    [setMapState]
  )

  return (
    <Box id="map-wrapper" sx={{
      flexGrow: 1,
      position: 'relative',  // Ensure the map can stretch to fill available space
      backgroundColor: T.ink,
    }}>
    <Map
      {...mapState}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onMove={onMove}
      mapStyle={mapStyle}
    >
      <CountyChoroplethLayer />
      <GAppLayer />
      <MetricsBand />
      <MapLegend />
      <ToggleClusterViewButton />
      <MapStyleButton />
    </Map>
  </Box>
  )

}

export default GappMap
