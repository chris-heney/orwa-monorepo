import { useQuery } from "@tanstack/react-query";
import { getAcceptedTerms } from "@orwa/terms-gate";
import { activeMembershipWatersystemsQuery } from "../helpers/activeMembershipWatersystemsQuery";
import {
  IScholarshipApplicationPayload,
  IWatersystemOption,
} from "../types/types";

interface IStrapiResponse {
  data: IStrapiRecord | IStrapiRecord[];
}

interface IStrapiRecord extends Record<string, unknown> {
  id: string | number;
  documentId?: string;
}

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const API_KEY = import.meta.env.VITE_API_KEY;

const _get = async (resource: string, query = "", method = "GET") => {
  const target = query ? `${resource}${query}` : resource;

  return fetch(`${API_ENDPOINT}/${target}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((strapiResponse: IStrapiResponse) => {
      if (Array.isArray(strapiResponse.data)) return strapiResponse.data;
      return strapiResponse.data ? [strapiResponse.data] : [];
    });
};

const _submitApplication = async (
  resource: string,
  data: IScholarshipApplicationPayload
) => {
  const payload = {
    ...data,
    accepted_terms: data.accepted_terms?.length
      ? data.accepted_terms
      : getAcceptedTerms(),
  };

  return fetch(`${API_ENDPOINT}/${resource}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  }).then((httpResponse) => httpResponse.json());
};

export const useGetWatersystems = () => {
  return useQuery({
    queryKey: ["watersystems", "active-membership"],
    queryFn: async () =>
      _get(
        "watersystems",
        activeMembershipWatersystemsQuery([
          "id",
          "documentId",
          "name",
          "county",
        ])
      ) as unknown as Promise<IWatersystemOption[]>,
  });
};

export const useGetSubmissions = () => {
  return useQuery({
    queryKey: ["logs", "scholarship-application"],
    queryFn: async () =>
      _get(
        "logs",
        "?filters[resource][$eq]=scholarship-application&pagination[limit]=1000&sort=createdAt:DESC"
      ),
  });
};

export const submitApplication = (payload: IScholarshipApplicationPayload) =>
  _submitApplication("submissions/scholarship-application", payload);

export const useSubmitApplication = (payload: IScholarshipApplicationPayload) =>
  submitApplication(payload);
