import { FormattedStoredStrapiFile, StoredStrapiFile } from "../types";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// const [isModalOpen, setModalOpen] = useState(false);
// const [emailInput, setEmailInput] = useState("");

export const formatBackendFile = (
  backendFile: StoredStrapiFile
): FormattedStoredStrapiFile => {
  // Strapi v5 media objects are flat: { id, name, url, ... }
  return {
    id: backendFile.id,
    rawFile: new File([], backendFile.name),
    src: `${API_ENDPOINT.replace("/api", "")}${backendFile.url}`,
    title: backendFile.name,
  };
};
