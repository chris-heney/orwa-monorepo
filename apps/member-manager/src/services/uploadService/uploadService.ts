const VITE_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const VITE_API_KEY = import.meta.env.VITE_API_KEY;

const uploadService = {

    uploadFile: async (file: File, raw?: true) => {
        const data = new FormData();
        data.append("files", file);
        return fetch(`${VITE_API_ENDPOINT}/api/upload`, {
            method: "POST",
            body: data,
            headers: {
                Authorization: `Bearer ${VITE_API_KEY}`,
            },
        })
            .then((httpResponse) => {
                if (!httpResponse.ok) {
                    throw new Error(`HTTP Error: ${httpResponse.status}`);
                }
                return httpResponse.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('Invalid response format from upload API');
                }
                return raw ? data[0] : data[0].id;
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
                throw error;
            });
    },
    uploadFiles: async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        return fetch(`${VITE_API_ENDPOINT}/api/upload`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${VITE_API_KEY}`,
            },
        })
            .then((httpResponse) => {
                if (!httpResponse.ok) {
                    throw new Error(`HTTP Error: ${httpResponse.status}`);
                }
                return httpResponse.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('Invalid response format from upload API');
                }
                return data.map(file => file.id);
            })
            .catch((error) => {
                console.error("Error uploading files:", error);
                throw error;
            });
    },
    getFile: async (id: number) => {
        return fetch(`${VITE_API_ENDPOINT}/api/upload/files/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${VITE_API_KEY}`,
            },
        })
            .then((httpResponse) => httpResponse.json())
            .then((data) => data);
    },
    getAllFiles: async () => {
        return fetch(`${VITE_API_ENDPOINT}/api/upload/files`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${VITE_API_KEY}`,
            },
        })
            .then((httpResponse) => {
                if (!httpResponse.ok) {
                    throw new Error(`HTTP Error: ${httpResponse.status}`);
                }
                return httpResponse.json();
            })
            .then((data) => {
                // Return array of file objects with id, name, url, formats, etc.
                return data;
            })
            .catch((error) => {
                console.error("Error fetching files:", error);
                throw error;
            });
    }
};

export default uploadService;