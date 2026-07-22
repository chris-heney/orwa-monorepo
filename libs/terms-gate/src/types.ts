export interface TermDocument {
  id: number | string;
  documentId?: string;
  title: string;
  slug: string;
  identifiers: string[];
  content: string;
  updatedAt: string;
}

export interface AcceptedTerm {
  slug: string;
  title: string;
  updatedAt: string;
  agreedAt: string;
}

export interface TermsGateProps {
  /** Identifier tags to match (in addition to Global when global=true). */
  terms?: string[];
  /** When true (default), always include terms tagged "Global". */
  global?: boolean;
  /** Strapi API base including `/api`, e.g. `http://localhost:13370/api`. */
  apiEndpoint: string;
  /** Optional Bearer token for authenticated fetches. */
  apiKey?: string;
  children: React.ReactNode;
}
