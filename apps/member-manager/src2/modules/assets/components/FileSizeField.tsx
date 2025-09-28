import { useRecordContext } from 'react-admin';

export const FileSizeField = () => {
    const record = useRecordContext();
    if (!record?.fileSize) return null;

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return <span>{formatFileSize(record.fileSize)}</span>;
};