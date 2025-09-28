import { Organization, TechStackGroup } from '@ci-connect/types';
import LayersIcon from '@mui/icons-material/Layers';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid2,
    Paper,
    Typography,
} from '@mui/material';
import { useGetList, useRecordContext } from 'react-admin';

export const TechStacksShow = () => {
    const record = useRecordContext<Organization>();

    // Fetch tech stack groups data
    const { data: techStackGroupsData, isLoading: techStackGroupsLoading } =
        useGetList<TechStackGroup>('techStackGroup', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'title', order: 'ASC' },
            meta: {
                populate: ['techStacks'],
            },
        });

    if (!record) return null;

    const selectedTechStacks = (record as any).techStacks || [];
    const selectedTechStackIds = selectedTechStacks.map((ts: any) => ts.id);

    // Group selected tech stacks by their group ID
    const getGroupsWithSelectedStacks = () => {
        const groupMap = new Map();

        // Group selected tech stacks by their techStackGroupId
        selectedTechStacks.forEach((techStack: any) => {
            const groupId = techStack.techStackGroupId;
            if (!groupMap.has(groupId)) {
                groupMap.set(groupId, {
                    id: groupId,
                    title: `Tech Stack Group ${groupId}`, // Default title
                    purpose: '',
                    icon: '🔧',
                    selectedTechStacks: [],
                });
            }
            groupMap.get(groupId).selectedTechStacks.push(techStack);
        });

        // Enhance with data from techStackGroupsData if available
        if (techStackGroupsData) {
            techStackGroupsData.forEach(group => {
                if (groupMap.has(group.id)) {
                    const existingGroup = groupMap.get(group.id);
                    groupMap.set(group.id, {
                        ...existingGroup,
                        title: group.title,
                        purpose: group.purpose,
                        icon: group.icon,
                        key: group.key,
                    });
                }
            });
        }

        return Array.from(groupMap.values());
    };

    const groupsWithSelected = getGroupsWithSelectedStacks();
    const totalSelectedCount = selectedTechStackIds.length;

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LayersIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Technology Stacks</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Summary */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Chip
                    label={`${totalSelectedCount} technology tools selected`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.9rem', py: 1 }}
                />
            </Box>

            {techStackGroupsLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>Loading technology stacks...</Typography>
                </Box>
            ) : groupsWithSelected.length > 0 ? (
                <Grid2 container spacing={2}>
                    {groupsWithSelected.map(group => (
                        <Grid2 size={12} key={group.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mr: 2 }}>
                                            {group.icon} {group.title}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2, fontStyle: 'italic' }}
                                    >
                                        {group.purpose}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                        }}
                                    >
                                        {group.selectedTechStacks.map(stack => (
                                            <Chip
                                                key={stack.id}
                                                label={stack.name}
                                                color="primary"
                                                variant="filled"
                                                sx={{ mb: 1 }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No technology stacks have been selected for this
                    organization.
                </Alert>
            )}

            {/* Optional: Show all available groups in collapsed state for reference */}
            {!techStackGroupsLoading &&
                techStackGroupsData &&
                techStackGroupsData.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Available Technology Categories
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            All available technology categories in the system:
                        </Typography>
                    </Box>
                )}
        </Paper>
    );
};

export default TechStacksShow;
