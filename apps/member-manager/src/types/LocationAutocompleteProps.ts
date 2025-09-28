import { LocationResult } from "./LocationResult";

export interface LocationAutocompleteProps {
  label?: string;
  value?: string;
  onChange: (location: LocationResult) => void;
} 