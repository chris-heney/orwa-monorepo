import { useEffect, useState } from "react";
import { useAppContext } from "../providers/AppContext";
import { useMapContext } from "../providers/MapContext";
import UpdateLocationModal from "./UpdateLocationModal";
import GAppMarker from "./GAppMarker";
import GappInfoWindow from "./GappInfoWindow";
import debounce from "lodash.debounce";
import { useUpdateGrantApplication } from "../helpers/APIService";
import mapboxSdk from "@mapbox/mapbox-sdk";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding";
import GappApplicationList from "./ApplicationSelectModal";
import { getOverlappingMarkers } from "../helpers/getOverlappingMarkers";

const GAppLayer = () => {
  const { applications } = useAppContext();
  const {
    mapRef,
    currentApplication,
    setCurrentApplication,
    isClusteredView,
    mapStyle,
    isApplicationSelectModalOpen,
    setIsApplicationSelectModalOpen,
    setOverlappingApplications,
    overlappingApplications,
  } = useMapContext();
  const [zoomedOut, setIsZoomedOut] = useState(true);

  const updateGrantApplication = useUpdateGrantApplication();

  const mapboxClient = mapboxSdk({
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
  });
  const geocodingService = Geocoding(mapboxClient);

  useEffect(() => {
    if (typeof applications === "undefined" || !applications.length) return;

    applications.forEach(async (gapp) => {
      if ((gapp.location ?? false) && gapp.location.lat && gapp.location.lng)
        return;

      const address = `${gapp.physical_address_street} ${
        gapp.physical_address_city
      }, ${gapp.physical_address_state ?? "Oklahoma"} ${
        gapp.physical_address_zip
      }`;

      if (address.length > 4) {
        const response = await geocodingService
          .forwardGeocode({
            query: address,
            limit: 1,
          })
          .send();

        const match = response.body.features[0];
        if (match) {
          gapp.location = {
            lat: match.geometry.coordinates[1],
            lng: match.geometry.coordinates[0],
          };

          await updateGrantApplication(gapp.id, {
            location: { ...gapp.location },
          });
        }
      }
    });
  }, [applications]);

  useEffect(() => {
    if (!mapRef.current || applications.length === 0) {
      return;
    }

    const map = mapRef.current.getMap();

    // Convert applications to GeoJSON format
    const geojsonData = {
      type: "FeatureCollection",
      features: applications
        .filter((app) => app.location)
        .map((app) => ({
          type: "Feature",
          properties: {
            id: app.id,
            award_amount: app.award_amount,
            color: app.status.data.color,
          },
          geometry: {
            type: "Point",
            coordinates: [app.location.lng, app.location.lat],
          },
        })),
    };

    // Debounced data update function
    const updateSourceData = debounce(() => {
      const source = map.getSource("applications") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(geojsonData as GeoJSON.FeatureCollection);
      }
    }, 200);

    // Add or update the source for cluster data
    if (!map.getSource("applications")) {
      map.addSource("applications", {
        type: "geojson",
        data: geojsonData as GeoJSON.FeatureCollection,
        cluster: true,
        clusterMaxZoom: 9, // Max zoom to cluster points on
        clusterRadius: 9, // Radius of each cluster when clustering points
      });
    } else {
      updateSourceData();
    }

    if (isClusteredView) {
      // Add cluster layer
      if (!map.getLayer("clusters")) {
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "applications",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#0300b9",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              15,
              100,
              25,
              750,
              35,
            ],
            "circle-opacity": 0.75,
            "text-color": "#fff",
          },
        });
      }

      // Add cluster count layer
      if (!map.getLayer("cluster-count")) {
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "applications",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 16,
            // set the text to white
          },
          paint: {
            "text-color": "#fff",
          },
        });
      }

      // Add unclustered point layer
      if (!map.getLayer("unclustered-point")) {
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "applications",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#0300b9",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        // Add click event listener for unclustered points
        map.on("click", "unclustered-point", (e: any) => {
          const features = e.features || [];
          const clickedFeature = features[0];
          if (clickedFeature && clickedFeature.properties) {
            const clickedApplication = applications.find(
              (app) => app.id === clickedFeature.properties?.id
            );

            if (clickedApplication) {
              setOverlappingApplications(
                getOverlappingMarkers(applications, clickedApplication)
              );
              if (getOverlappingMarkers(applications, clickedApplication).length > 1) {
                setIsApplicationSelectModalOpen(true);
                setCurrentApplication(null);
              } else {
                setOverlappingApplications([]);
                setCurrentApplication(clickedApplication);
              }
            }
          }
        });
      }
    }

    if (!isClusteredView) {
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "applications",
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Add click event listener for unclustered points
      map.on("click", "unclustered-point", (e: any) => {
        const features = e.features || [];
        const clickedFeature = features[0];
        if (clickedFeature && clickedFeature.properties) {
          const clickedApplication = applications.find(
            (app) => app.id === clickedFeature.properties?.id
          );
          if (clickedApplication) {
            setOverlappingApplications(
              getOverlappingMarkers(applications, clickedApplication)
            );
            if (getOverlappingMarkers(applications, clickedApplication).length > 1) {
              setIsApplicationSelectModalOpen(true);
              setCurrentApplication(null);
            } else {
              // setOverlappingApplications([]);
              setCurrentApplication(clickedApplication);
            }
          }
        }
      });
    }

    // Event listener for zoom level to toggle between clusters and individual markers
    const checkZoomLevel = debounce(() => {
      const zoomLevel = map.getZoom();
      setIsZoomedOut(zoomLevel < 8); // Toggle clustered view based on zoom level
    }, 100);

    map.on("zoomend", checkZoomLevel);

    return () => {
      // Ensure map is valid before cleaning up layers and sources
      if (mapRef.current) {
        const map = mapRef.current.getMap();

        if (map.getLayer("clusters")) {
          map.removeLayer("clusters");
        }
        if (map.getLayer("cluster-count")) {
          map.removeLayer("cluster-count");
        }
        if (map.getLayer("unclustered-point")) {
          map.removeLayer("unclustered-point");
        }
        if (map.getSource("applications")) {
          map.removeSource("applications");
        }
      }

      map.off("zoomend", checkZoomLevel);
    };
  }, [mapRef, applications, isClusteredView, mapStyle]);

  // Function to find overlapping markers

  return (
    <div>
      <UpdateLocationModal />

      {/* Render GappInfoWindow if an currentApplication is selected */}
      {currentApplication && <GappInfoWindow />}

      {/* Render custom GAppMarkers if not in clustered view */}
      {(!zoomedOut || !isClusteredView) &&
        applications.map((app) => (
          <GAppMarker
            key={app.id}
            position={app.location}
            currentApplication={app}
          />
        ))}

      {/* Modal for showing overlapping applications */}
      {isApplicationSelectModalOpen && (
        <GappApplicationList
          applications={overlappingApplications}
          onClose={() => setIsApplicationSelectModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GAppLayer;
