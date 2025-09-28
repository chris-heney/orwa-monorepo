import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface BucketSelectorProps {
    selectedBucket: string;
    onBucketChange: (bucket: string) => void;
    buckets: string[];
    onRefreshBuckets: () => void;
    onCreateBucket: (bucketName: string) => Promise<void>;
}

export const BucketSelector: React.FC<BucketSelectorProps> = ({
    selectedBucket,
    onBucketChange,
    buckets,
    onRefreshBuckets,
    onCreateBucket,
}) => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newBucketName, setNewBucketName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleCreateBucket = async () => {
        // User only has access to 'synapse' bucket, cannot create new buckets
        setError('You do not have permission to create new buckets. You only have access to the "synapse" bucket.');
        return;
    };

    return (
        <Box display="flex" alignItems="center" gap={2}>
            <FormControl fullWidth>
                <InputLabel>Bucket</InputLabel>
                <Select
                    value={selectedBucket}
                    onChange={(e) => onBucketChange(e.target.value)}
                    label="Bucket"
                >
                    {buckets.map((bucket) => (
                        <MenuItem key={bucket} value={bucket}>
                            {bucket}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* New Bucket button hidden - user only has access to 'synapse' bucket */}

            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
                <DialogTitle>Create New Bucket</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Bucket Name"
                        fullWidth
                        variant="outlined"
                        value={newBucketName}
                        onChange={(e) => setNewBucketName(e.target.value.toLowerCase())}
                        helperText="3-63 characters, lowercase letters, numbers, dots, and hyphens only"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateBucket} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};