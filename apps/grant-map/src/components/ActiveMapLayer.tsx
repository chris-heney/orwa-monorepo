import { useAppContext } from "../providers/AppContext";
import { FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl/mapbox";

const ActiveMapLayer = () => {
  // Access the activeLayer from the context
  const { activeLayer } = useAppContext();

  // Ensure activeLayer exists and contains regions with polygon data
  if (
    !activeLayer ||
    !activeLayer.regions ||
    activeLayer.regions.length === 0
  ) {
    return null; // No active layer, return nothing
  }

  // Construct GeoJSON features from the activeLayer regions
  const geojsonFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: activeLayer.regions.map((region) => ({
      type: "Feature",
      properties: {
        name: region.name,
        description: region.description,
      },
      geometry: region.polygon.geometry, // Make sure this matches your region structure
    })),
  };

  return (
    <Source id="active-layer-data" type="geojson" data={geojsonFeatures}>
      <Layer
        key="active-layer"
        id="feature-active-layer"
        type="fill"
        paint={{
          "fill-color": "transparent", 
          "fill-outline-color": "black", 
          "fill-opacity": 1,
          "fill-emissive-strength": 1
        }}
        
      />
    </Source>
  );
};

export default ActiveMapLayer;
