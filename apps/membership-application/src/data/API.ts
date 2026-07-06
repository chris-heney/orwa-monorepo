import { useQuery } from "@tanstack/react-query";
import { AdminSubmissionAssociate, AdminWatersystemSubmission, EmailPayload } from "../types";
import { WatersystemMembershipPayload } from "../types/WatersystemMebership";
import { AssociateMembershipPayload } from "../types/AssociateMembership";

// Strapi v5 returns flat records: { id, documentId, ...fields } with no
// .attributes/.data nesting inside each record.
interface IStrapiResponse {
  data: IStrapiRecord | IStrapiRecord[];
}

interface IStrapiRecord {
  id: number;
  documentId: string;
  [key: string]: unknown;
}

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const API_KEY = import.meta.env.VITE_API_KEY;

// set the context for the submission

const _get = async (resource: string, query = "", method = "GET") => {
  const target = query ? `${resource}/${query}` : resource;

  return fetch(`${API_ENDPOINT}/${target}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((strapiResponse: IStrapiResponse) => strapiResponse.data);
};

const _submitMembershipForm = async (
  resource: string,
  data: WatersystemMembershipPayload | AssociateMembershipPayload
) => {
  return fetch(`${API_ENDPOINT}/${resource}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((data) => data);
};

const _uploadFile = async (file: File) => {
  const data = new FormData();

  data.append("files", file);

  return fetch(`${API_ENDPOINT}/upload`, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((data) => data);
};

const _sendEmail = async (data: EmailPayload) => {
  return fetch(`${API_ENDPOINT}/mailer/send-email`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((data) => data);
};

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const oneYearAgoFormatted = formatDate(oneYearAgo);

export const useGetWatersystems = () => {
  // return useQuery({ queryKey: ['watersystems'], queryFn: async () => _get('watersystems', `?filters[payment_last_date][$gt]=${oneYearAgoFormatted}&pagination[limit]=1000&populate=*&sort=name:ASC`) })
  return useQuery({
    queryKey: ["watersystems"],
    queryFn: async () =>
      _get("watersystems", `?pagination[limit]=1000&populate=*&sort=name:ASC`),
  });
};

export const useGetAssociates = () => {
  return useQuery({
    queryKey: ["assocites"],
    queryFn: async () =>
      _get("associates", "?pagination[limit]=1000&populate=*&sort=name:ASC"),
  });
};

export const useGetApplicationId = () => {
  return useQuery({
    queryKey: ["grant-application-finals"],
    queryFn: async () => {
      const data = await _get(
        "grant-application-finals",
        "?pagination[limit]=10000"
      );
      // get the last application id and add 1
      return Array.isArray(data) ? data[data.length - 1].id + 1 : 0;
    },
  });
};

export const useGetMemberships = (context: "Watersystem" | "Associate") => {
  return useQuery({
    queryKey: ["memberships"],
    queryFn: async () =>
      _get(
        "memberships",
        `?pagination[limit]=1000&populate=*&filter[context]=${context}`
      ),
  });
};

export const useGetSubmissions = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: async () =>
      _get(
        "logs",
        `?filters[resource]=watersystems&filters[resource]=associates&filters[createdAt][$gte]=2025-01-01&pagination[limit]=1000&populate=*`
      ),
  });
};

export const submitMembershipForm = (
  payload:
    | WatersystemMembershipPayload
    | AssociateMembershipPayload
    | AdminSubmissionAssociate
    | AdminWatersystemSubmission,
  customPath?: string
) => {
  const path = window.location.hash.substring(2);

  return _submitMembershipForm(
    `membership-forms/${customPath ?? path}`,
    payload
  );
};

export const sendEmail = (email: EmailPayload) => {
  _sendEmail(email);
};

export const useUploadFile = (file: File) => {
  _uploadFile(file);
};
