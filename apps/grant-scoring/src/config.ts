// Prefer VITE_API_KEY (monorepo convention); accept VITE_API_TOKEN for legacy env files.
export const API_ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT
export const API_KEY: string =
  import.meta.env.VITE_API_KEY || import.meta.env.VITE_API_TOKEN
export const BASE_URI: string = import.meta.env.VITE_BASE_URI
