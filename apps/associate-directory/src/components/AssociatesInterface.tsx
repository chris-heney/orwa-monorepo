export interface IAssociates {
  id: number;
  documentId: string;
  address_city: string;
  address_state: string;
  address_street: string;
  address_zip: string;
  mailing_address_street: string;
  mailing_address_city: string;
  mailing_address_state: string;
  mailing_address_zip: string;
  annual_report_type: string | null;
  application_date: string | null;
  category: string;
  createdAt: string;
  directory_mailed: boolean;
  email: string;
  member_level: string;
  membership_directory_type: string | null;
  name: string;
  payment_amount: number | null;
  payment_details: string | null;
  payment_last_date: string | null;
  payment_method: string | null;
  phone: string;
  total_years: number | null;
  updatedAt: string;
  website: string;
  wp_eid: number | null;
  wp_uid: number | null;
  logo: ILogo[] | null;
  contacts: IContact[] | null;
  contact_primary: IContact | null;
  contact_secondary: IContact | null;
}

interface ILogo {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  createdAt: string;
  ext: string;
  formats: {
    [key: string]: {
      ext: string;
      url: string;
    };
  } | null;
  hash: string;
  height: number;
  mime: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  size: number;
  updatedAt: string;
  url: string;
}

interface IContact {
  id: number;
  email: string;
  phone: string;
  title: string;
  contact_type: string | null;
  createdAt: string;
  first: string | null;
  last: string | null;
  publishedAt: string;
  updatedAt: string;
}
