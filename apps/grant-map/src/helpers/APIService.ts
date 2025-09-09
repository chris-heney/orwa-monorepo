import axios from "axios";
import IGrantApplication from "../types/IGrantApplication";
import { Filter } from "../types/Filter";
import { SpatialRegion } from "../types/SpatialRegion";
import { MapLayer } from "../types/MapLayer";
import { polygon } from "@turf/turf";

const STRAPI_API_ENDPOINT = import.meta.env.VITE_STRAPI_API_ENDPOINT;

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

    const { data: response } = await axios.get(
      `${STRAPI_API_ENDPOINT}/grant-application-finals?pagination[limit]=${
        perPage ?? 10000
      }&populate=*&sort=legal_entity_name:ASC${filterParams}&filters[regions][Congressional District][$eq]=Senate%20District%203`,
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

export const useGetMapLayers = async () => {
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

  return Promise.all(
    mapLayerRequests.map(async (mapLayerRequest, i): Promise<MapLayer> => {
      const response = mapLayerRequest?.url
        ? await fetch(mapLayerRequest?.url)
        : await fetch(
            `data/${mapLayerRequest.file}/${mapLayerRequest.file}.kml`
          );

      const kmlText = await response.text();
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
