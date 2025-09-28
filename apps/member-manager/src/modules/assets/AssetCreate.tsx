import { Box, Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import { Create, useNotify, useRedirect } from 'react-admin';
import { BucketSelector } from './components/BucketSelector';
import { FileUploader } from './components/FileUploader';
import { config } from '../../config';

const AssetCreate = () => {
    const [selectedBucket, setSelectedBucket] = useState('');
    const [buckets, setBuckets] = useState<string[]>([]);
    const notify = useNotify();
    const redirect = useRedirect();

    const fetchBuckets = async () => {
        try {
            // Since user only has access to 'synapse' bucket, return a fixed bucket list
            setBuckets(['synapse']);
        } catch (error) {
            notify('Failed to fetch buckets', { type: 'error' });
        }
    };

    const createBucket = async (bucketName: string) => {
        // User only has access to 'synapse' bucket, cannot create new buckets
        notify('You do not have permission to create new buckets. You only have access to the "synapse" bucket.', { type: 'error' });
    };

    const handleUploadComplete = () => {
        notify('Files uploaded successfully', { type: 'success' });
        redirect('list', 'asset');
    };

    return (
        <Create title="Upload Files">
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        File Upload
                    </Typography>

                    <Box mb={3}>
                        <BucketSelector
                            selectedBucket={selectedBucket}
                            onBucketChange={setSelectedBucket}
                            buckets={buckets}
                            onRefreshBuckets={fetchBuckets}
                            onCreateBucket={createBucket}
                        />
                    </Box>

                    <FileUploader onUploadComplete={handleUploadComplete} />
                </CardContent>
            </Card>
        </Create>
    );
};

export default AssetCreate;
