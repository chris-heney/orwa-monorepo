import {
    Settings as SettingsIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    Chip,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Tooltip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useDataProvider, useNotify } from 'react-admin';

interface DisplayCondition {
    id: number;
    ruleType: string;
    field: string | null;
    operator: string;
    value: string;
    isRequired: boolean;
}

interface StepConditionsModalProps {
    open: boolean;
    stepId: string | null;
    stepLabel: string | null;
    onClose: () => void;
}

export const StepConditionsModal = ({
    open,
    stepId,
    stepLabel,
    onClose,
}: StepConditionsModalProps) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [conditions, setConditions] = useState<DisplayCondition[]>([]);
    const [loading, setLoading] = useState(false);
    const [onboardingStepId, setOnboardingStepId] = useState<number | null>(null);

    // Fetch conditions when modal opens
    useEffect(() => {
        if (open && stepId) {
            fetchConditions();
        }
    }, [open, stepId]);

    const fetchConditions = async () => {
        if (!stepId) return;

        setLoading(true);
        try {
            // First, find the onboarding step by stepId
            const stepsResponse = await dataProvider.getList('onboarding-step', {
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'id', order: 'ASC' },
                filter: { stepId: stepId },
            });

            if (stepsResponse.data.length > 0) {
                const step = stepsResponse.data[0];
                setOnboardingStepId(step.id);

                // Then fetch the conditions for this step
                const conditionsResponse = await dataProvider.getList('onboarding-display-condition', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { onboardingStepId: step.id },
                });

                setConditions(conditionsResponse.data);
            } else {
                setConditions([]);
                setOnboardingStepId(null);
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
            notify('Error fetching display conditions', { type: 'error' });
            setConditions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCondition = async (conditionId: number) => {
        try {
            await dataProvider.delete('onboarding-display-condition', { id: conditionId });
            setConditions(conditions.filter(c => c.id !== conditionId));
            notify('Display condition deleted', { type: 'success' });
        } catch (error) {
            console.error('Error deleting condition:', error);
            notify('Error deleting display condition', { type: 'error' });
        }
    };

    const getRuleTypeColor = (ruleType: string) => {
        const colors = {
            PAYLOAD_FIELD: 'primary',
            URL_PARAM: 'secondary',
            PACKAGE_SELECTED: 'success',
            CORE_SERVICE_SELECTED: 'info',
            INDUSTRY: 'warning',
            ALWAYS_SHOW: 'success',
            NEVER_SHOW: 'error',
            CUSTOM_LOGIC: 'default',
        };
        return colors[ruleType as keyof typeof colors] || 'default';
    };

    const getOperatorColor = (operator: string) => {
        const colors = {
            EQUALS: 'primary',
            NOT_EQUALS: 'secondary',
            CONTAINS: 'info',
            NOT_CONTAINS: 'warning',
            IN: 'success',
            NOT_IN: 'error',
            EXISTS: 'default',
            NOT_EXISTS: 'default',
        };
        return colors[operator as keyof typeof colors] || 'default';
    };

    const handleNavigateToConditions = () => {
        // Navigate to the display conditions list with a filter for this step
        const url = `/onboarding-display-condition${onboardingStepId ? `?filter=${encodeURIComponent(JSON.stringify({ onboardingStepId }))}` : ''}`;
        window.open(url, '_blank');
    };

    const handleCreateCondition = () => {
        // Navigate to create a new condition with pre-filled step
        const url = `/onboarding-display-condition/create${onboardingStepId ? `?source=${encodeURIComponent(JSON.stringify({ onboardingStepId }))}` : ''}`;
        window.open(url, '_blank');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { minHeight: '500px' }
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <SettingsIcon />
                    <Typography variant="h6">
                        Display Conditions for "{stepLabel}"
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                {loading ? (
                    <Typography>Loading conditions...</Typography>
                ) : (
                    <Box>
                        {!onboardingStepId ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    This step doesn't exist in the onboarding steps database yet. 
                                    Save the deck first to create the step, then you can configure conditions.
                                </Typography>
                            </Alert>
                        ) : (
                            <>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Display Logic:</strong> Steps are shown when all required conditions (AND) 
                                        are met and at least one optional condition (OR) is met (if any exist).
                                    </Typography>
                                </Alert>

                                {conditions.length === 0 ? (
                                    <Card sx={{ mb: 2 }}>
                                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                            <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                No Display Conditions
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                This step will always be shown. Add conditions to make it dynamic.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <List>
                                        {conditions.map((condition, index) => (
                                            <Box key={condition.id}>
                                                <ListItem
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                                <Chip
                                                                    label={condition.ruleType}
                                                                    color={getRuleTypeColor(condition.ruleType) as any}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                                <Chip
                                                                    label={condition.operator}
                                                                    color={getOperatorColor(condition.operator) as any}
                                                                    size="small"
                                                                />
                                                                {condition.isRequired ? (
                                                                    <Chip
                                                                        label="Required (AND)"
                                                                        color="error"
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                ) : (
                                                                    <Chip
                                                                        label="Optional (OR)"
                                                                        color="success"
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                )}
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box>
                                                                {condition.field && (
                                                                    <Typography variant="body2" component="span">
                                                                        <strong>Field:</strong> {condition.field}
                                                                        {' • '}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2" component="span">
                                                                    <strong>Value:</strong> {condition.value || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Tooltip title="Delete Condition">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => handleDeleteCondition(condition.id)}
                                                                color="error"
                                                                size="small"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                                {index < conditions.length - 1 && (
                                                    <Divider sx={{ my: 1 }} />
                                                )}
                                            </Box>
                                        ))}
                                    </List>
                                )}

                                <Box display="flex" gap={1} mt={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleCreateCondition}
                                    >
                                        Add Condition
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleNavigateToConditions}
                                    >
                                        Manage All Conditions
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
