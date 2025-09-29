export interface GooglePlace {
  place_id: string;
  description: string;
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
} 