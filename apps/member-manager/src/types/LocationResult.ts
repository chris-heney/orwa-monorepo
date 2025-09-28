export interface LocationResult {
  formattedAddress: string;
  city: string;
  state: string;
  street?: string;
  streetNumber?: string;
  postalCode?: string;
  country?: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
} 