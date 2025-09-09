import Map, { ViewStateChangeEvent } from "react-map-gl/mapbox"
import { useCallback } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import GAppLayer from "./GAppLayer"
import ToggleClusterViewButton from "./ToggleClusterViewButton"
import { useAppContext } from "../providers/AppContext"
import { useMapContext } from "../providers/MapContext"
import MapStyleButton from "./MapStyleButton"
import { Box } from "@mui/material"
import ActiveMapLayer from "./ActiveMapLayer"
import SelectMapLayer from "./SelectMapLayer"
import SelectMapRegion from "./SelectMapRegion"


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
      position: 'relative'  // Ensure the map can stretch to fill available space
    }}>
    <Map
      {...mapState}
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onMove={onMove}
      mapStyle={mapStyle}
    >
      <GAppLayer />
     <ActiveMapLayer />
      {/* Overlay Buttons */}
      <Box sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
      <SelectMapLayer />
      <SelectMapRegion />
      </Box>
      <ToggleClusterViewButton />
      <MapStyleButton />
    </Map>
  </Box>
  )

}

export default GappMap