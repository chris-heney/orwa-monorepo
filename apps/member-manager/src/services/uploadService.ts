import { config } from '../config';

class UploadService {
    private getAuthHeaders() {
        return {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        };
    }

    /**
     * Upload a single file to the specified bucket
     */
    async uploadFile(file: File, bucketName: string = 'default', folderPath?: string): Promise<number> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucketName', bucketName);
        formData.append('description', '');
        formData.append('tags', JSON.stringify([]));
        if (folderPath) {
            formData.append('folderPath', folderPath.replace(/^\/+|\/+$/g, ''));
        }

        const response = await fetch(`${config.VITE_ASSET_API_URL}/upload`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(error.error || error.message || `Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result.data.id;
    }

    /**
     * Delete a file by ID
     */
    async deleteFile(id: number): Promise<void> {
        const response = await fetch(`${config.VITE_ASSET_API_URL}/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete file: ${response.status} ${response.statusText}`);
        }
    }
    /**
     * Upload multiple files
     */
    async uploadFiles(files: File[], bucketName: string = 'default', folderPath?: string): Promise<number[]> {
        const uploadPromises = files.map(file => this.uploadFile(file, bucketName, folderPath));
        return Promise.all(uploadPromises);
    }
}

// Create and export a singleton instance
const uploadService = new UploadService();
export default uploadService;