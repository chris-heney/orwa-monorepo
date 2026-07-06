import { Dispatch, SetStateAction } from "react";
import {
  EmptyWatersystemPayload,
  Watersystem,
  WatersystemMembershipPayload,
} from "./WatersystemMebership";
import {
  Associate,
  AssociateMembershipPayload,
  EmptyAssociateMembershipPayload,
} from "./AssociateMembership";

export interface IStep {
  label: string;
  component: React.ReactNode;
}

export type Identifier = number;

export interface IAddress {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface IContactPayload {
  first: string;
  last: string;
  email: string;
  phone: string;
  title: string;
}

export interface StrapiFormattedFile {
  rawFile: File;
  src: string;
  title: string;
}

export interface FormattedStoredStrapiFile extends StrapiFormattedFile {
  id: Identifier;
}

// Strapi v5: media files come back flat ({ id, name, url, ... }),
// no .attributes wrapper.
export interface StoredStrapiFile {
  id: Identifier;
  name: string;
  url: string;
  caption?: string | null;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
    };
  };
}

export interface FormSubmittedContext {
  isFormSubmitted: boolean;
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
}

export interface EmailPayload {
  to: string;
  from: string;
  html: string;
  subject: string;
}

export interface MembershipItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  max_price?: number;
  max_purchasable?: number;
  min_purchasable?: number;
  memberships?: Membership[]; // Relation to Membership
}

export interface Membership {
  id: number;
  name: string;
  description?: string;
  price: number;
  context: "Watersystem" | "Associate"; // Enum-like context options
  // Strapi v5: populated relations are flat arrays/objects
  membership_items?: MembershipItem[];
}

export interface MembershipContext {
  memberships: Membership[];
  isMembershipsLoading: boolean;
}

export interface IWatersystemContext {
  watersystems: Watersystem[];
  isWatersystemsLoading: boolean;
}

export interface IAssociateContext {
  associates: Associate[];
  isAssociatesLoading: boolean;
}
export interface PaymentInformation {
  card: string;
  exp: string;
  cvv: string;
}

export type submissionOptions =
  | AssociateMembershipPayload
  | null
  | EmptyAssociateMembershipPayload
  | EmptyWatersystemPayload
  | WatersystemMembershipPayload;

export interface EntryPayloadContext {
  entryPayload: submissionOptions;
  setEntryPayload: Dispatch<SetStateAction<submissionOptions>>;
}

export interface entryPayload {
  createdAt: Date;
  id: number;
  resource: string;
  data: submissionOptions;
}

export interface UserContext {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isAdminView: boolean;
  setIsAdminView: Dispatch<SetStateAction<boolean>>;
  viewingEntries: boolean;
  setViewingEntries: Dispatch<SetStateAction<boolean>>;
}

export interface AdminOptions {
  registrantNotification: true;
  adminNotification: true;
  customEmail: "";
  resubmit: true;
}

export interface AdminWatersystemSubmission extends WatersystemMembershipPayload {
  adminOptions: AdminOptions;
}

export interface AdminSubmissionAssociate extends AssociateMembershipPayload {
  adminOptions: AdminOptions;
}

