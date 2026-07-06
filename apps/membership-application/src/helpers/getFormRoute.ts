import { AssociateMembershipPayload } from "../types/AssociateMembership";
import { WatersystemMembershipPayload } from "../types/WatersystemMebership";

export const getFormRoute = (entry: {
  resource: string;
  data: WatersystemMembershipPayload | AssociateMembershipPayload;
}) => {
  const { resource, data } = entry;

  const isRenewal =
    (data as WatersystemMembershipPayload)?.watersystem ||
    (data as AssociateMembershipPayload)?.associate;

  // Determine the URL based on the resource and renewal status
  let url = "";
  switch (resource) {
    case "watersystems":
      url = isRenewal ? "/watersystem-renewal" : "/watersystem";
      break;
    case "associates":
      url = isRenewal ? "/associate-renewal" : "/associate";
      break;
    default:
      url = `/${resource}`;
      break;
  }

  return url;
};
