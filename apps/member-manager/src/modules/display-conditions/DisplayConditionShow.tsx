import {
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    DateField,
    ReferenceField,
    TopToolbar,
    EditButton,
    ListButton,
    DeleteButton,
    FunctionField,
} from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
    Alert,
    Grid2,
} from '@mui/material';

const DisplayConditionShowActions = () => (
    <TopToolbar>
        <EditButton />
        <ListButton />
        <DeleteButton />
    </TopToolbar>
);

const getRuleTypeDescription = (ruleType: string) => {
    const descriptions = {
        PAYLOAD_FIELD: 'Check a field in the onboarding payload (e.g., ownershipType = "FRANCHISE")',
        URL_PARAM: 'Check a URL parameter (e.g., deckId, organizationId)',
        PACKAGE_SELECTED: 'Check if specific packages are selected',
        CORE_SERVICE_SELECTED: 'Check if specific core services are selected',
        INDUSTRY: 'Check the industry type',
        SESSION_RESUMED: 'Check if user is resuming a session',
        ORGANIZATION_EXISTS: 'Check if organizationId is provided',
        ALWAYS_SHOW: 'Always show this step (no conditions)',
        NEVER_SHOW: 'Never show this step (disabled)',
        CUSTOM_LOGIC: 'Custom logic evaluation (for complex rules)',
    };
    return descriptions[ruleType as keyof typeof descriptions] || '';
};

const DisplayConditionShow = () => {
    return (
        <Show actions={<DisplayConditionShowActions />}>
            <SimpleShowLayout>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 8 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Condition Details
                                </Typography>
                                
                                <Box mb={2}>
                                    <ReferenceField
                                        source="onboardingStepId"
                                        reference="onboarding-step"
                                        label="Applies to Step"
                                    >
                                        <TextField source="label" />
                                    </ReferenceField>
                                </Box>

                                <Box mb={2}>
                                    <FunctionField
                                        label="Rule Type"
                                        render={(record: any) => (
                                            <Box>
                                                <Chip
                                                    label={record.ruleType}
                                                    color="primary"
                                                    sx={{ mb: 1 }}
                                                />
                                                <Alert severity="info">
                                                    <Typography variant="body2">
                                                        {getRuleTypeDescription(record.ruleType)}
                                                    </Typography>
                                                </Alert>
                                            </Box>
                                        )}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <TextField source="field" label="Field" />
                                </Box>

                                <Box mb={2}>
                                    <FunctionField
                                        label="Operator"
                                        render={(record: any) => (
                                            <Chip
                                                label={record.operator}
                                                color="secondary"
                                            />
                                        )}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <TextField source="value" label="Value" />
                                </Box>

                                <Box mb={2}>
                                    <FunctionField
                                        label="Required (AND Logic)"
                                        render={(record: any) => (
                                            record.isRequired ? (
                                                <Chip label="Required (AND)" color="error" size="small" />
                                            ) : (
                                                <Chip label="Optional (OR)" color="success" size="small" />
                                            )
                                        )}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Metadata
                                </Typography>
                                
                                <Box mb={1}>
                                    <DateField source="createdAt" label="Created" showTime />
                                </Box>
                                
                                <Box mb={1}>
                                    <DateField source="updatedAt" label="Updated" showTime />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Logic Explanation
                                </Typography>
                                
                                <Alert severity="info">
                                    <Typography variant="body2">
                                        <strong>AND Logic:</strong> When isRequired = true, this condition must be met along with all other required conditions.
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <strong>OR Logic:</strong> When isRequired = false, this condition can be met as an alternative to other conditions.
                                    </Typography>
                                </Alert>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </SimpleShowLayout>
        </Show>
    );
};

export default DisplayConditionShow;
