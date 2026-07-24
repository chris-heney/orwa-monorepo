import axios from "axios";
import IGrant from "../types/IGrant";
import IGrantApplication from "../types/IGrantApplication";
import { Filter } from "../types/Filter";
import { SpatialRegion } from "../types/SpatialRegion";
import { MapLayer } from "../types/MapLayer";
import { polygon } from "@turf/helpers";

const STRAPI_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const login = async (identifier: string, password: string) => {
  return await (
    await fetch(`${STRAPI_API_ENDPOINT}/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    })
  ).json();
};

// check if the user is logged in if jwt is in local storage
export const useIsLoggedIn = () => () => {
  return !!localStorage.getItem("jwt") && !!localStorage.getItem("user");
};

export const useLogin = () => async (email: string, password: string) => {
  const credentials = await login(email, password);
  if (credentials.jwt) {
    localStorage.setItem("jwt", credentials.jwt);
    localStorage.setItem("user", JSON.stringify(credentials.user));
  }
  return credentials;
};

export const useUpdateGrantApplication =
  () => async (id: number, gapp: Partial<IGrantApplication>) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return [];

    const response = await (
      await fetch(
        `${STRAPI_API_ENDPOINT}/grant-application-finals/${id?.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify({ data: gapp }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
    ).json();

    return response;
  };

//if
export const useGetGrantApplications =
  () =>
  async (
    filters: Filter[],
    perPage?: number[]
  ): Promise<IGrantApplication[]> => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return [];
    let filterParams = "";
    filterParams =
      "&" +
      filters
        .flatMap((f) => {
          if (Array.isArray(f.value)) {
            return f.value.map((item) => `filters[${f.key}]=${item}`);
          } else {
            return `filters[${f.key}]=${f.value}`;
          }
        })
        .join("&");

    // Only request what the map actually renders. `populate=*` pulled every
    // relation plus huge unused scalars (base64 `signature`,
    // `grant_application_score`) — ~63 MB / 6.7s per request vs ~1.9 MB / 1.9s.
    const usedFields = [
      "legal_entity_name",
      "facility_id",
      "county",
      "physical_address_street",
      "physical_address_city",
      "physical_address_state",
      "physical_address_zip",
      "award_amount",
      "requested_grant_amount",
      "approved_project_cost",
      "combined_cost_of_projects",
      "population_served",
      "drinking_or_wastewater",
      "regions",
      "location",
      "application_id",
      "application_date",
      "committee_date",
      "closed_out",
      "email",
    ]
      .map((f, i) => `fields[${i}]=${f}`)
      .join("&");

    // Populate only the relation fields the UI reads. `populate[X]=true`
    // returned every column of every related row (~940 KB of a 1.5 MB
    // response); scoping to the used fields cuts the payload ~40% and server
    // time in half.
    const usedRelations = Object.entries({
      status: ["name", "color"],
      sub_status: ["name"],
      payouts: ["amount"],
      approved_projects: ["name", "classification", "context"],
      selected_projects: ["name", "classification", "context"],
    })
      .flatMap(([relation, fields]) =>
        fields.map((f, i) => `populate[${relation}][fields][${i}]=${f}`)
      )
      .join("&");

    const { data: response } = await axios.get(
      `${STRAPI_API_ENDPOINT}/grant-application-finals?pagination[limit]=${
        perPage ?? 10000
      }&${usedFields}&${usedRelations}&sort=legal_entity_name:ASC${filterParams}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.data || !response.data.length) return [];

    return response.data;
  };

// KML boundary layers are static; fetch and parse them once per session and
// share the result between the layer picker and the spatial enrichment pass
// (they used to each trigger their own fetch + DOMParser run).
let mapLayersPromise: Promise<MapLayer[]> | null = null;

export const useGetMapLayers = async () => {
  if (mapLayersPromise) return mapLayersPromise;

  const mapLayerRequests: MapLayerRequest[] = [
    {
      title: "Senate District",
      file: "cb_2023_40_sldu_500k",
    },
    {
      title: "Congressional District",
      file: "cb_2023_40_cd118_500k",
    },
    {
      title: "Tribal District",
      file: "cb_2023_us_aitsn_500k",
    },
    {
      title: "State House District",
      file: "cb_2023_40_sldl_500k",
    }
  ];

  mapLayersPromise = Promise.all(
    mapLayerRequests.map(async (mapLayerRequest, i): Promise<MapLayer> => {
      const emptyLayer: MapLayer = {
        file: mapLayerRequest.file || "",
        title: mapLayerRequest.title || `KML Document ${i + 1}`,
        description: "",
        meta: [],
        regions: [],
      };

      let kmlText: string;
      try {
        const response = mapLayerRequest?.url
          ? await fetch(mapLayerRequest?.url)
          : await fetch(
              `data/${mapLayerRequest.file}/${mapLayerRequest.file}.kml`
            );
        if (!response.ok) return emptyLayer;
        kmlText = await response.text();
      } catch {
        return emptyLayer;
      }
      // Missing files behind SPA fallbacks come back as HTML with a 200;
      // don't waste a DOMParser pass (or downstream point-in-polygon work).
      if (!kmlText.includes("<kml")) return emptyLayer;

      const kmlDocument = new DOMParser().parseFromString(kmlText, "text/xml");

      const regions = Array.from(
        kmlDocument.querySelectorAll("Folder Placemark")
      )
        .filter((placemark: Element) => {
          const coordinatesElement = placemark.querySelector(
            "Polygon coordinates"
          );

          if (!coordinatesElement) return false;

          const pointsTextBlob = coordinatesElement.textContent;

          if (!pointsTextBlob) return false;

          return placemark;
        })
        .map((placemark, index) => {
          const coordinatesElement = placemark.querySelector(
            "Polygon coordinates"
          );

          const pointsTextBlob = coordinatesElement?.textContent;

          if (!pointsTextBlob) return false;

          const points = pointsTextBlob
            .trim()
            .split(" ")
            .map((point) => point.split(",").map(Number))
            .map(([lng, lat]) => [lng, lat]); // Turf expects [lng, lat]

          const shape = polygon([points]);

          return {
            name:
              placemark.querySelector('SimpleData[name="NAMELSAD"]')?.textContent ||
              `Placemark ${index + 1}`,
            description:
              placemark.querySelector("description")?.textContent ??
              ("" as string),
            polygon: shape,
          };
        }) as unknown as SpatialRegion[];

      return {
        file: mapLayerRequest.file || "",
        title: mapLayerRequest.title || `KML Document ${i + 1}`,
        description:
          kmlDocument.querySelector("description")?.textContent || "",
        meta: [], // Set up actual meta data if required
        regions,
      };
    })
  );

  return mapLayersPromise;
};

/**
 * The grant program records (annual allocation / admin amounts) that anchor
 * the pool metrics. Returns the newest grant that actually carries an
 * allocation; Strapi 5 returns null (not undefined) for empty fields.
 */
export const useGetGrants = () => async (): Promise<IGrant | null> => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return null;

  const { data: response } = await axios.get(
    `${STRAPI_API_ENDPOINT}/grants?sort=opens:DESC&pagination[limit]=25`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!response.data || !response.data.length) return null;

  const withAllocation = (response.data as IGrant[]).filter(
    (g) => g.grant_amount != null && Number(g.grant_amount) > 0
  );
  return withAllocation[0] ?? null;
};

export const useGetProjectTypes =
  () => async (classification: "Wastewater" | "Drinking Water") => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return [];

    const { data: response } = await axios.get(
      `${STRAPI_API_ENDPOINT}/project-types`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          "filters[classification]": classification,
        },
      }
    );

    if (!response.data || !response.data.length) return [];

    return response.data;
  };

export const useGetStatuses = () => async () => {
  const jwt = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!jwt || !user) return [];

  const { data: response } = await axios.get(
    `${STRAPI_API_ENDPOINT}/grant-statuses`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        // Kelly wants to be able to see all statuses
        'filters[id]' :  user.email === 'rig@orwa.org' ? [1,3,8,14,13,6,12] : []
    }}
  );

  if (!response.data || !response.data.length) return [];

  return response.data;
};
