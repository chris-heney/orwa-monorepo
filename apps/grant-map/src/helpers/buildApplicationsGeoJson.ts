import IGrantApplication from "../types/IGrantApplication";

/**
 * Assemble the single GeoJSON FeatureCollection backing the map's clustered
 * `applications` source. Only the properties the layers actually style with
 * are copied onto features — full records stay in React state and are looked
 * up by id on click.
 */
const buildApplicationsGeoJson = (
  applications: IGrantApplication[],
  getColor: (app: IGrantApplication) => string
): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
  type: "FeatureCollection",
  features: applications
    .filter(
      (app) =>
        app.location != null &&
        app.location.lat != null &&
        app.location.lng != null
    )
    .map((app) => ({
      type: "Feature" as const,
      properties: {
        id: app.id,
        award_amount: app.award_amount || 0,
        color: getColor(app),
      },
      geometry: {
        type: "Point" as const,
        coordinates: [app.location.lng, app.location.lat],
      },
    })),
});

export default buildApplicationsGeoJson;
