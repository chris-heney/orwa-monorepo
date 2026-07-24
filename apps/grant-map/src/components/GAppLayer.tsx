import { useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-map-gl/mapbox";
import { useAppContext } from "../providers/AppContext";
import { useMapContext } from "../providers/MapContext";
import UpdateLocationModal from "./UpdateLocationModal";
import GAppMarker from "./GAppMarker";
import GappInfoWindow from "./GappInfoWindow";
import debounce from "lodash.debounce";
import { useUpdateGrantApplication } from "../helpers/APIService";
import GappApplicationList from "./ApplicationSelectModal";
import { getOverlappingMarkers } from "../helpers/getOverlappingMarkers";
import { stageColorForApplication } from "../helpers/stages";
import buildApplicationsGeoJson from "../helpers/buildApplicationsGeoJson";
import IGrantApplication from "../types/IGrantApplication";
import { T } from "../theme/tokens";

/** Marker size scales with award amount (sqrt-ish, so mid awards read). */
const AWARD_RADIUS: mapboxgl.Expression = [
  "interpolate",
  ["linear"],
  ["get", "award_amount"],
  0,
  5,
  50000,
  7,
  250000,
  10,
  1000000,
  14,
];

const SOURCE_ID = "applications";
/** Zoom at or above which the detailed DOM price-tag markers appear. */
const DETAIL_ZOOM = 8;

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
  // Re-render when the map instance becomes available (GAppLayer mounts as a
  // child of <Map>, but data can arrive before the map finishes loading).
  const { current: mapHandle } = useMap();

  const [viewport, setViewport] = useState<{
    zoom: number;
    bounds: mapboxgl.LngLatBounds | null;
  }>({ zoom: 0, bounds: null });

  const updateGrantApplication = useUpdateGrantApplication();

  // Latest applications for map event handlers registered once per style.
  const applicationsRef = useRef(applications);
  applicationsRef.current = applications;

  // Single memoized FeatureCollection: the one GeoJSON source drives
  // clustering, counts and point styling on the GPU.
  const geojsonData = useMemo(
    () => buildApplicationsGeoJson(applications, stageColorForApplication),
    [applications]
  );
  const geojsonRef = useRef(geojsonData);
  geojsonRef.current = geojsonData;

  // Geocode-and-persist pass for records that still lack coordinates. Runs
  // sequentially (the old unbounded forEach fired one request per record at
  // once) and loads the mapbox-sdk geocoder on demand so the ~100 KB client
  // stays out of the startup bundle for the common all-geocoded case.
  useEffect(() => {
    const missing = applications.filter(
      (gapp) => !(gapp.location?.lat && gapp.location?.lng)
    );
    if (!missing.length) return;

    let cancelled = false;
    (async () => {
      const [{ default: mapboxSdk }, { default: Geocoding }] =
        await Promise.all([
          import("@mapbox/mapbox-sdk"),
          import("@mapbox/mapbox-sdk/services/geocoding"),
        ]);
      const geocodingService = Geocoding(
        mapboxSdk({ accessToken: import.meta.env.VITE_MAPBOX_TOKEN })
      );

      for (const gapp of missing) {
        if (cancelled) return;

        const address = `${gapp.physical_address_street} ${
          gapp.physical_address_city
        }, ${gapp.physical_address_state ?? "Oklahoma"} ${
          gapp.physical_address_zip
        }`;
        if (address.length <= 4) continue;

        const response = await geocodingService
          .forwardGeocode({ query: address, limit: 1 })
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
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications]);

  // Source + layers lifecycle. Rebuilt only when the style or cluster mode
  // changes — data updates go through setData below instead of tearing the
  // source down on every state change.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handlePointClick = (e: mapboxgl.MapLayerMouseEvent) => {
      const clickedFeature = (e.features ?? [])[0];
      if (!clickedFeature?.properties) return;
      const currentApplications = applicationsRef.current;
      const clickedApplication = currentApplications.find(
        (app) => app.id === clickedFeature.properties?.id
      );
      if (!clickedApplication) return;

      const overlapping = getOverlappingMarkers(
        currentApplications,
        clickedApplication
      );
      setOverlappingApplications(overlapping);
      if (overlapping.length > 1) {
        setIsApplicationSelectModalOpen(true);
        setCurrentApplication(null);
      } else {
        setOverlappingApplications([]);
        setCurrentApplication(clickedApplication);
      }
    };

    // Standard GIS UX: clicking a cluster zooms to its expansion level.
    const handleClusterClick = (e: mapboxgl.MapLayerMouseEvent) => {
      const feature = (e.features ?? [])[0];
      const clusterId = feature?.properties?.cluster_id;
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
      if (clusterId == null || !source) return;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) return;
        map.easeTo({
          center: (feature.geometry as GeoJSON.Point).coordinates as [
            number,
            number
          ],
          zoom,
        });
      });
    };

    const setup = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "geojson",
          data: geojsonRef.current,
          cluster: isClusteredView,
          clusterMaxZoom: 9, // Max zoom to cluster points on
          clusterRadius: 9, // Radius of each cluster when clustering points
        });
      }

      if (isClusteredView) {
        if (!map.getLayer("clusters")) {
          map.addLayer({
            id: "clusters",
            type: "circle",
            source: SOURCE_ID,
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                T.water,
                25,
                T.deepWater,
                100,
                T.committed,
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                15,
                25,
                22,
                100,
                30,
              ],
              "circle-opacity": 0.85,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "rgba(234, 243, 250, 0.55)",
              "circle-emissive-strength": 1,
            },
          });
        }

        if (!map.getLayer("cluster-count")) {
          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: SOURCE_ID,
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 14,
            },
            paint: {
              "text-color": "#EAF3FA",
            },
          });
        }
      }

      if (!map.getLayer("unclustered-point")) {
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: SOURCE_ID,
          ...(isClusteredView
            ? { filter: ["!", ["has", "point_count"]] }
            : {}),
          paint: {
            "circle-color": ["get", "color"],
            "circle-radius": AWARD_RADIUS,
            "circle-opacity": 0.9,
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "rgba(234, 243, 250, 0.85)",
            "circle-emissive-strength": 1,
          },
        });
      }
    };

    // The style may still be loading on first mount; in that case the
    // style.load listener below performs the initial setup.
    if (map.isStyleLoaded()) setup();
    // A style switch wipes custom sources/layers; re-add them when the new
    // style finishes loading.
    map.on("style.load", setup);
    map.on("click", "unclustered-point", handlePointClick);
    map.on("click", "clusters", handleClusterClick);

    // Track zoom/bounds so the detailed DOM markers render only for the
    // visible viewport instead of every application at once.
    const syncViewport = debounce(() => {
      setViewport({ zoom: map.getZoom(), bounds: map.getBounds() });
    }, 100);
    syncViewport();
    map.on("moveend", syncViewport);

    return () => {
      map.off("style.load", setup);
      map.off("click", "unclustered-point", handlePointClick);
      map.off("click", "clusters", handleClusterClick);
      map.off("moveend", syncViewport);
      syncViewport.cancel();

      if (mapRef.current && map.style) {
        for (const layerId of ["clusters", "cluster-count", "unclustered-point"]) {
          if (map.getLayer(layerId)) map.removeLayer(layerId);
        }
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, mapHandle, isClusteredView, mapStyle]);

  // Data-only updates: push new features into the existing source.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    const source = map?.getSource(SOURCE_ID) as
      | mapboxgl.GeoJSONSource
      | undefined;
    if (source) source.setData(geojsonData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geojsonData]);

  // Detailed price-tag markers are DOM elements — cull them to the current
  // viewport (with a half-screen buffer) so zooming in renders dozens, not
  // the whole dataset.
  const visibleApplications = useMemo((): IGrantApplication[] => {
    const zoomedOut = viewport.zoom < DETAIL_ZOOM;
    if (zoomedOut && isClusteredView) return [];
    if (!viewport.bounds) return [];

    const sw = viewport.bounds.getSouthWest();
    const ne = viewport.bounds.getNorthEast();
    const lngPad = (ne.lng - sw.lng) / 2;
    const latPad = (ne.lat - sw.lat) / 2;

    return applications.filter(
      (app) =>
        app.location != null &&
        app.location.lng >= sw.lng - lngPad &&
        app.location.lng <= ne.lng + lngPad &&
        app.location.lat >= sw.lat - latPad &&
        app.location.lat <= ne.lat + latPad
    );
  }, [applications, viewport, isClusteredView]);

  return (
    <div>
      <UpdateLocationModal />

      {/* Render GappInfoWindow if an currentApplication is selected */}
      {currentApplication && <GappInfoWindow />}

      {/* Detailed markers for the visible viewport only */}
      {visibleApplications.map((app) => (
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
