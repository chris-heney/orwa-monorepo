import React, { useState } from 'react';
import { useGetList } from 'react-admin';
import { UniversalFilters } from '../../../../_components';
import { 
    Box, 
    Typography, 
    Button, 
    Divider, 
    IconButton,
    useTheme 
} from '@mui/material';
import { 
    Add as AddIcon, 
    Edit as EditIcon,
    Topic as TopicIcon 
} from '@mui/icons-material';
import { CreateTopicModal } from '../../topics/components/CreateTopicModal';
import { EditTopicModal } from '../../topics/components/EditTopicModal';

const statusOptions = [
    { id: 'true', name: 'Active' },
    { id: 'false', name: 'Inactive' },
];

export const SubscriberFilters = ({ header = true }: { header?: boolean }) => {
    const theme = useTheme();
    const [createTopicOpen, setCreateTopicOpen] = useState(false);
    const [editTopicOpen, setEditTopicOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);

    // Get topics for the filter
    const { data: topics = [], refetch: refetchTopics } = useGetList('pub-sub-topic', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
    });

    const multiSelectFilters = [
        {
            source: 'topicId',
            label: 'Topics',
            options: topics.map((topic: any) => ({
                id: topic.id,
                name: topic.name,
            })),
            chipColor: 'primary' as const,
            showAvatar: true,
        },
        {
            source: 'isActive',
            label: 'Status',
            options: statusOptions,
            chipColor: 'secondary' as const,
        },
    ];

    const handleEditTopic = (topic: any) => {
        setSelectedTopic(topic);
        setEditTopicOpen(true);
    };

    const handleTopicCreated = () => {
        refetchTopics();
        setCreateTopicOpen(false);
    };

    const handleTopicUpdated = () => {
        refetchTopics();
        setEditTopicOpen(false);
        setSelectedTopic(null);
    };

    return (
        <>
            <UniversalFilters
                header={header}
                searchPlaceholder="Search subscribers..."
                multiSelectFilters={multiSelectFilters}
                searchField="topic.name"
            >
                {/* Topic Management Section */}
                <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <TopicIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Topic Management
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateTopicOpen(true)}
                            size="small"
                            fullWidth
                            sx={{
                                justifyContent: 'flex-start',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: `${theme.palette.primary.main}08`,
                                },
                            }}
                        >
                            Create New Topic
                        </Button>

                        {topics.length > 0 && (
                            <>
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ mt: 1, mb: 1 }}
                                >
                                    Quick Edit Topics:
                                </Typography>
                                
                                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {topics.map((topic: any) => (
                                        <Box
                                            key={topic.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 1,
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.hover,
                                                },
                                            }}
                                        >
                                            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                                                {topic.name}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditTopic(topic)}
                                                sx={{ ml: 1 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </UniversalFilters>

            {/* Modals */}
            <CreateTopicModal
                open={createTopicOpen}
                onClose={() => setCreateTopicOpen(false)}
                onSuccess={handleTopicCreated}
            />
            
            <EditTopicModal
                open={editTopicOpen}
                onClose={() => setEditTopicOpen(false)}
                onSuccess={handleTopicUpdated}
                topic={selectedTopic}
            />
        </>
    );
};
