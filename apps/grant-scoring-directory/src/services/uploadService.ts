
const VITE_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const VITE_API_KEY = import.meta.env.VITE_API_KEY;

const uploadService = {
    uploadFile: async (file: File) => {
        const data = new FormData();
        data.append("files", file);
        return fetch(`${VITE_API_ENDPOINT}/upload`, {
            method: "POST",
            body: data,
            headers: {
                Authorization: `Bearer ${VITE_API_KEY}`,
            },
        })
            .then((httpResponse) => httpResponse.json())
            .then((data) => {
                return data[0].id
            });
    },
    uploadFiles: async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        return fetch(`${VITE_API_ENDPOINT}/upload`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${VITE_API_KEY}`,
            },
        })
            .then((httpResponse) => httpResponse.json())
            .then((data) => data.map((file: any) => file.id));
    },
};

export default uploadService;