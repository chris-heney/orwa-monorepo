import React from 'react';
import {
    Dialog,
    DialogTitle,
    Box,
    Typography,
} from '@mui/material';
import {
    Topic as TopicIcon,
} from '@mui/icons-material';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import { createRecord } from '../../../../_utils/createRecord';
import TopicFormFields from '../../topics/components/TopicFormFields';

interface CreateTopicModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSuccess = async (createdRecord: any) => {
        // Emit PubSub events like the controller does
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pubsub/emit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    model: 'pubSubTopic',
                    action: 'created',
                    id: createdRecord.id,
                    data: createdRecord,
                }),
            });

            if (!response.ok) {
                console.warn('Failed to emit PubSub event for created topic');
            }
        } catch (error) {
            console.error('Error emitting PubSub event:', error);
        }

        onSuccess();
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TopicIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Create New Topic
                    </Typography>
                </Box>
            </DialogTitle>
            
            <Create resource="pub-sub-topic" redirect={false}>
                <SimpleForm
                    onSubmit={(data: any) => {
                        // Filter data to only include valid Prisma fields
                        const validData = {
                            name: data.name,
                            isResource: data.isResource || false,
                            resourceType: data.resourceType || null,
                            resourceLabel: data.resourceLabel || null,
                            tableName: data.tableName || null,
                            onCreate: data.onCreate || false,
                            onUpdate: data.onUpdate || false,
                            onDelete: data.onDelete || false,
                        };
                        
                        return createRecord(
                            validData,
                            dataProvider,
                            notify,
                            refresh,
                            'pub-sub-topic',
                            handleSuccess,
                        );
                    }}
                    sx={{
                        p: 3,
                        pt: 2,
                    }}
                    toolbar={
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            gap: 1, 
                            px: 3, 
                            pb: 3, 
                            pt: 1 
                        }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    minWidth: '100px',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    cursor: 'pointer',
                                    minWidth: '100px',
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                }}
                            >
                                Create Topic
                            </button>
                        </Box>
                    }
                >
                    <TopicFormFields />
                </SimpleForm>
            </Create>
        </Dialog>
    );
};

