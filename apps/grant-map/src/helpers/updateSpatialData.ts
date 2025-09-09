import { point, booleanPointInPolygon } from "@turf/turf";
import IGrantApplication from "../types/IGrantApplication";
import { useGetMapLayers, useUpdateGrantApplication } from "./APIService";

/**
 * Crawls through grant applications to set the regional spatial data
 * @param applications Array of grant applications
 * @param applicationIndex Current index in the applications array
 */
const updateSpatialData = async (
  applications: IGrantApplication[],
  applicationIndex: number
) => {
  // @TODO: Use hook to get the layers

  const mapLayers = await useGetMapLayers();

  const updateRegion = useUpdateGrantApplication();

  const updateApplication = async (
    applications: IGrantApplication[],
    applicationIndex: number
  ) => {

    const currentApplication = applications[applicationIndex];
    const { lng, lat } = currentApplication.location ? currentApplication.location : { lng: null, lat: null };


    // @TODO: AND if the current grant currentApplication doesn't already have spatial data for that file (/aka-"Group")
    if (lng && lat) {
      const pt = point([lng, lat]);

      const spatialRegions: {
        [key: MapLayerName]: string;
      } = {};

      // Loop through KML files and features to find the matching regions
      for (const layer of mapLayers) {
        for (const region of layer.regions) {
          if (booleanPointInPolygon(pt, region.polygon)) {
            spatialRegions[layer.title] = region.name;
            break;
          }
        }
      }
      // @TODO: Only run IF spatial regions have been applied:
      if (currentApplication.regions === null) {
        await updateRegion(currentApplication.id, {
          regions: {
            ...spatialRegions,
          },
        });
      }
    }

    if (applicationIndex + 1 < applications.length) {
      // Throttle the next recursive call with a delay of 250ms
      setTimeout(() => {
        updateApplication(applications, applicationIndex + 1);
      }, 250);
    }
  };

  return await updateApplication(applications, applicationIndex + 1);
};

export default updateSpatialData;
