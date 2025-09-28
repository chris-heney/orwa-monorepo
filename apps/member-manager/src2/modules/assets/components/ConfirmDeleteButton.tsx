import {
    Delete as DeleteIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import { config } from '../../../config';
import { clearResourceCache } from '../../../dataProvider/ciWebServices';

interface ConfirmDeleteButtonProps {
    size?: 'small' | 'medium' | 'large';
    onDeleteComplete?: () => void;
}

export const ConfirmDeleteButton: React.FC<ConfirmDeleteButtonProps> = ({
    size = 'small',
    onDeleteComplete,
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    if (!record) return null;

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            // Delete from both MinIO and PostgreSQL via our content API
            const deleteResponse = await fetch(
                `${config.VITE_ASSET_API_URL}/${record.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );

            if (!deleteResponse.ok) {
                const errorData = await deleteResponse.json().catch(() => ({}));
                throw new Error(
                    errorData.error ||
                        errorData.message ||
                        `Failed to delete file: ${deleteResponse.status} ${deleteResponse.statusText}`
                );
            }

            const responseData = await deleteResponse.json().catch(() => ({}));
            
            notify(
                responseData.message || 'File deleted successfully', 
                { type: 'success' }
            );
            setOpen(false);
            clearResourceCache('asset');
            refresh();
            onDeleteComplete?.();
        } catch (error) {
            console.error('Delete failed:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete file';
            setError(errorMessage);
            notify(errorMessage, { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton
                size={size}
                onClick={() => setOpen(true)}
                title="Delete file"
                color="error"
                sx={{
                    '&:hover': {
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                    },
                }}
            >
                <DeleteIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => {
                    if (!loading) {
                        setOpen(false);
                        setError(null);
                    }
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                    <WarningIcon color="warning" />
                    Confirm Delete
                </DialogTitle>

                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to delete this file? This action
                        cannot be undone.
                    </Typography>

                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200',
                        }}
                    >
                        <Typography variant="body2" fontWeight="bold">
                            File: {record.originalName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Bucket: {record.bucketName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Size:{' '}
                            {record.fileSize
                                ? formatFileSize(record.fileSize)
                                : 'Unknown'}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        color="warning.main"
                        sx={{ mt: 2 }}
                    >
                        ⚠️ This will permanently delete the file from MinIO
                        storage and remove all metadata.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            setError(null);
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={loading}
                        startIcon={
                            loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <DeleteIcon />
                            )
                        }
                    >
                        {loading ? 'Deleting...' : 'Delete File'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
