import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import IGrantApplication from "../types/IGrantApplication";
import { useGetMapLayers, useUpdateGrantApplication } from "./APIService";

/**
 * One-time spatial enrichment: tags applications that don't yet have their
 * district regions (`regions === null`) by point-in-polygon against the KML
 * boundary layers, persisting the result to Strapi so it never runs again
 * for that record.
 *
 * The whole pass is skipped when nothing needs enrichment or when no boundary
 * layer actually loaded — previously it fetched and DOM-parsed every KML file
 * and walked every application on each data load.
 */
const updateSpatialData = async (applications: IGrantApplication[]) => {
  const pending = applications.filter(
    (app) =>
      app.regions === null && app.location?.lat != null && app.location?.lng != null
  );
  if (!pending.length) return;

  const mapLayers = await useGetMapLayers();
  const layersWithRegions = mapLayers.filter((layer) => layer.regions.length);
  // Without boundary geometry there is nothing meaningful to persist.
  if (!layersWithRegions.length) return;

  const updateRegion = useUpdateGrantApplication();

  for (const application of pending) {
    const { lng, lat } = application.location;
    const pt = point([lng, lat]);

    const spatialRegions: Record<string, string> = {};
    for (const layer of layersWithRegions) {
      for (const region of layer.regions) {
        if (booleanPointInPolygon(pt, region.polygon)) {
          spatialRegions[layer.title] = region.name;
          break;
        }
      }
    }

    if (Object.keys(spatialRegions).length) {
      await updateRegion(application.id, { regions: { ...spatialRegions } });
      // Reflect locally so dependent filters work without a refetch.
      application.regions = spatialRegions;
      // Throttle writes so a large backfill doesn't hammer the API.
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
};

export default updateSpatialData;
