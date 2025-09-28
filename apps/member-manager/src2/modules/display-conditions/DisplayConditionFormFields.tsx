import { FormSection } from '../../_components/FormSection';
import {
    Settings as SettingsIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import {
    Box,
    Grid2,
    Typography,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    SelectInput,
    BooleanInput,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';

const ruleTypeChoices = [
    { id: 'PAYLOAD_FIELD', name: 'Payload Field' },
    { id: 'URL_PARAM', name: 'URL Parameter' },
    { id: 'PACKAGE_SELECTED', name: 'Package Selected' },
    { id: 'CORE_SERVICE_SELECTED', name: 'Core Service Selected' },
    { id: 'INDUSTRY', name: 'Industry' },
    { id: 'SESSION_RESUMED', name: 'Session Resumed' },
    { id: 'ORGANIZATION_EXISTS', name: 'Organization Exists' },
    { id: 'ALWAYS_SHOW', name: 'Always Show' },
    { id: 'NEVER_SHOW', name: 'Never Show' },
    { id: 'CUSTOM_LOGIC', name: 'Custom Logic' },
];

const operatorChoices = [
    { id: 'EQUALS', name: 'Equals' },
    { id: 'NOT_EQUALS', name: 'Not Equals' },
    { id: 'CONTAINS', name: 'Contains' },
    { id: 'NOT_CONTAINS', name: 'Not Contains' },
    { id: 'GREATER_THAN', name: 'Greater Than' },
    { id: 'LESS_THAN', name: 'Less Than' },
    { id: 'EXISTS', name: 'Exists' },
    { id: 'NOT_EXISTS', name: 'Not Exists' },
    { id: 'IN', name: 'In (comma-separated values)' },
    { id: 'NOT_IN', name: 'Not In (comma-separated values)' },
    { id: 'REGEX_MATCH', name: 'Regex Match' },
];

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

const getFieldRequiredForRuleType = (ruleType: string) => {
    return !['ALWAYS_SHOW', 'NEVER_SHOW', 'SESSION_RESUMED', 'ORGANIZATION_EXISTS'].includes(ruleType);
};

export const DisplayConditionFormFields = () => {
    const form = useFormContext();
    const ruleType = useWatch({ control: form.control, name: 'ruleType' });
    const operator = useWatch({ control: form.control, name: 'operator' });

    const fieldRequired = getFieldRequiredForRuleType(ruleType);
    const valueRequired = !['EXISTS', 'NOT_EXISTS'].includes(operator);

    return (
        <Box sx={{ width: '100%' }}>
            <FormSection title="Display Condition Details" icon={<SettingsIcon />}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <ReferenceInput
                            source="onboardingStepId"
                            reference="onboarding-step"
                            perPage={1000}
                        >
                            <AutocompleteInput
                                optionText="label"
                                fullWidth
                                label="Onboarding Step"
                                helperText="Select the step this condition applies to"
                                sx={{ mb: 2 }}
                            />
                        </ReferenceInput>

                        <SelectInput
                            source="ruleType"
                            label="Rule Type"
                            choices={ruleTypeChoices}
                            fullWidth
                            helperText="Type of condition to evaluate"
                            sx={{ mb: 2 }}
                        />

                        {ruleType && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    {getRuleTypeDescription(ruleType)}
                                </Typography>
                            </Alert>
                        )}
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <SelectInput
                            source="operator"
                            label="Operator"
                            choices={operatorChoices}
                            fullWidth
                            helperText="How to compare the field value"
                            sx={{ mb: 2 }}
                        />

                        <BooleanInput
                            source="isRequired"
                            label="Required Condition"
                            helperText="If true, this condition must be met (AND logic). If false, it's optional (OR logic)."
                            sx={{ mb: 2 }}
                        />
                    </Grid2>
                </Grid2>
            </FormSection>

            <FormSection title="Field Configuration" icon={<InfoIcon />}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextInput
                            source="field"
                            label="Field Name"
                            fullWidth
                            disabled={!fieldRequired}
                            helperText={
                                fieldRequired
                                    ? "Field name to check (e.g., 'ownershipType', 'industryId')"
                                    : "Field not required for this rule type"
                            }
                            sx={{ mb: 2 }}
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextInput
                            source="value"
                            label="Value"
                            fullWidth
                            multiline
                            rows={3}
                            disabled={!valueRequired}
                            helperText={
                                valueRequired
                                    ? "Value to compare against. For IN/NOT_IN operators, use comma-separated values. For JSON values, use proper JSON format."
                                    : "Value not required for this operator"
                            }
                            sx={{ mb: 2 }}
                        />
                    </Grid2>
                </Grid2>
            </FormSection>

            <Accordion sx={{ mt: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                        Examples & Usage Guide
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" paragraph>
                        <strong>Common Examples:</strong>
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                        <Typography component="li" variant="body2">
                            <strong>Franchise Questions:</strong> Rule Type: PAYLOAD_FIELD, Field: ownershipType, Operator: EQUALS, Value: FRANCHISE
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Industry-specific Step:</strong> Rule Type: PAYLOAD_FIELD, Field: industryId, Operator: IN, Value: 1,2,3
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Package Required:</strong> Rule Type: PACKAGE_SELECTED, Field: packageId, Operator: EQUALS, Value: 5
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Always Show:</strong> Rule Type: ALWAYS_SHOW (no field or value needed)
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Logic:</strong> Multiple conditions on the same step are combined using AND logic if all are required, 
                        or OR logic if any are optional (isRequired = false).
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
