import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    TextField,
    Typography,
    Grid2,
    Button,
    IconButton,
    List,
    ListItem,
    Tooltip,
} from '@mui/material';
import {
    TextInput,
    SelectInput,
    BooleanInput,
    useInput,
    required,
    ReferenceInput,
    minLength,
    maxLength,
    number,
    minValue,
    maxValue,
    AutocompleteInput,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LexicalEditor from '../../../../_components/LexicalEditor/LexicalEditor';
import MergeTagTextField from './MergeTagTextField';
import ContentSelector from './ContentSelector';
import ResourceAutocomplete from '../../../../_components/ResourceAutocomplete';
import { CreateTopicModal } from '../../topics/components/CreateTopicModal';

// Custom validation functions
const validateEmailWithMergeTags = (value: string) => {
    if (!value) return 'Email is required';

    // Check if it contains merge tags (basic check for {record.field} pattern)
    const mergeTagPattern = /\{[^}]+\}/;
    if (mergeTagPattern.test(value)) {
        return undefined; // Allow merge tags
    }

    // Otherwise validate as regular email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
        return 'Must be a valid email address or use merge tags like {record.email}';
    }

    return undefined;
};

const validatePhoneNumber = (value: string) => {
    if (!value) return 'Phone number is required';

    // Check if it contains merge tags
    const mergeTagPattern = /\{[^}]+\}/;
    if (mergeTagPattern.test(value)) {
        return undefined; // Allow merge tags
    }

    // Otherwise validate as phone number (E.164 format)
    const phonePattern = /^\+[1-9]\d{1,14}$/;
    if (!phonePattern.test(value)) {
        return 'Must be a valid phone number in E.164 format (e.g., +15551234567) or use merge tags like {record.phone}';
    }

    return undefined;
};

const validateUrl = (value: string) => {
    if (!value) return 'URL is required';

    // Check if it contains merge tags
    const mergeTagPattern = /\{[^}]+\}/;
    if (mergeTagPattern.test(value)) {
        return undefined; // Allow merge tags in URL
    }

    try {
        new URL(value);
        return undefined;
    } catch {
        return 'Must be a valid URL or contain merge tags';
    }
};

const validateJson = (value: string) => {
    if (!value) return undefined; // JSON body is optional

    // Check if it contains merge tags - if so, skip JSON validation
    const mergeTagPattern = /\{[^}]+\}/;
    if (mergeTagPattern.test(value)) {
        return undefined; // Allow merge tags in JSON
    }

    try {
        JSON.parse(value);
        return undefined;
    } catch {
        return 'Must be valid JSON or contain merge tags';
    }
};

const validateTimeout = [
    required('Timeout is required'),
    number('Must be a number'),
    minValue(1, 'Timeout must be at least 1 second'),
    maxValue(300, 'Timeout cannot exceed 300 seconds (5 minutes)'),
];

const validateRetries = [
    required('Max retries is required'),
    number('Must be a number'),
    minValue(0, 'Retries cannot be negative'),
    maxValue(10, 'Maximum 10 retries allowed'),
];

const validateSubjectLine = [
    required('Subject is required'),
    minLength(1, 'Subject cannot be empty'),
    maxLength(
        78,
        'Subject should not exceed 78 characters for better email client compatibility'
    ),
];

const validateSmsMessage = [
    required('Message is required'),
    minLength(1, 'Message cannot be empty'),
    maxLength(1600, 'SMS message cannot exceed 1600 characters'),
];

interface SubscriberFormFieldsProps {
    onInsertFieldClick?: () => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`subscriber-tabpanel-${index}`}
            aria-labelledby={`subscriber-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const SubscriberFormFields: React.FC<SubscriberFormFieldsProps> = ({
    onInsertFieldClick,
}) => {
    const { watch } = useFormContext();
    const subscriberType = watch('type') || 'EMAIL';
    const [tabValue, setTabValue] = useState(0);
    const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getTabsForType = () => {
        switch (subscriberType) {
            case 'EMAIL':
                return ['Basic', 'Email Content', 'Headers & Attachments'];
            case 'TEXT':
                return ['Basic', 'SMS Content', 'Media'];
            case 'API':
                return [
                    'Basic',
                    'Request Config',
                    'Authentication',
                    'Body & Response',
                ];
            default:
                return ['Basic'];
        }
    };

    const tabs = getTabsForType();

    return (
        <Box sx={{ width: '100%' }}>
            {/* Common Fields */}
            <Box sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Subscriber Configuration
                </Typography>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <ReferenceInput
                                    source="topicId"
                                    reference="pub-sub-topic"
                                    perPage={1000}
                                >
                                    <AutocompleteInput
                                        optionText="name"
                                        fullWidth
                                        label="Associated Topic (Optional)"
                                        helperText="Select a topic to associate with this deck"
                                    />
                                </ReferenceInput>
                            </Box>
                            <Tooltip title="Create New Topic">
                                <IconButton
                                    onClick={() =>
                                        setIsCreateTopicModalOpen(prev => !prev)
                                    }
                                    sx={{
                                        mt: 1,
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: 'primary.contrastText',
                                        },
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <SelectInput
                            source="type"
                            choices={[
                                { id: 'EMAIL', name: 'Email' },
                                { id: 'TEXT', name: 'SMS/Text' },
                                { id: 'API', name: 'API Webhook' },
                            ]}
                            validate={required('Subscriber type is required')}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <BooleanInput source="isActive" defaultValue={true} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <ResourceAutocomplete />
                    </Grid2>
                </Grid2>
            </Box>

            {/* Type-specific Configuration */}
            {subscriberType !== 'BASIC' && (
                <Box sx={{ p: 0 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="subscriber configuration tabs"
                        >
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab}
                                    id={`subscriber-tab-${index}`}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {subscriberType === 'EMAIL' && (
                        <>
                            <TabPanel value={tabValue} index={0}>
                                <EmailBasicFields
                                    onInsertFieldClick={onInsertFieldClick}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <EmailContentFields
                                    onInsertFieldClick={onInsertFieldClick}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={2}>
                                <EmailHeadersAttachmentsFields />
                            </TabPanel>
                        </>
                    )}

                    {subscriberType === 'TEXT' && (
                        <>
                            <TabPanel value={tabValue} index={0}>
                                <TextBasicFields
                                    onInsertFieldClick={onInsertFieldClick}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <TextContentFields
                                    onInsertFieldClick={onInsertFieldClick}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={2}>
                                <TextMediaFields />
                            </TabPanel>
                        </>
                    )}

                    {subscriberType === 'API' && (
                        <>
                            <TabPanel value={tabValue} index={0}>
                                <ApiBasicFields
                                    onInsertFieldClick={onInsertFieldClick}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <ApiRequestFields
                                    onInsertFieldClick={onInsertFieldClick}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={2}>
                                <ApiAuthFields />
                            </TabPanel>
                            <TabPanel value={tabValue} index={3}>
                                <ApiBodyFields
                                    onInsertFieldClick={onInsertFieldClick}
                                />
                            </TabPanel>
                        </>
                    )}
                </Box>
            )}

            {/* Create Topic Modal */}
            <CreateTopicModal
                open={isCreateTopicModalOpen}
                onClose={() => setIsCreateTopicModalOpen(false)}
                onSuccess={() => setIsCreateTopicModalOpen(false)}
            />
        </Box>
    );
};

// Email Components
const EmailBasicFields: React.FC<{ onInsertFieldClick?: () => void }> = ({
    onInsertFieldClick,
}) => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.email.fromName"
                label="From Name"
                onInsertFieldClick={onInsertFieldClick}
                helperText="The name that appears in the 'From' field"
                validate={[
                    required('From name is required'),
                    maxLength(50, 'From name should not exceed 50 characters'),
                ]}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.email.fromEmail"
                label="From Email"
                onInsertFieldClick={onInsertFieldClick}
                helperText="The email address that appears in the 'From' field"
                validate={validateEmailWithMergeTags}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.email.replyTo"
                label="Reply To"
                onInsertFieldClick={onInsertFieldClick}
                helperText="Email address for replies (optional)"
                validate={value =>
                    value ? validateEmailWithMergeTags(value) : undefined
                }
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.email.to"
                label="To (supports merge tags)"
                onInsertFieldClick={onInsertFieldClick}
                helperText="Use merge tags like {record.email}"
                validate={validateEmailWithMergeTags}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.email.cc"
                label="CC (optional)"
                onInsertFieldClick={onInsertFieldClick}
                helperText="Carbon copy recipients"
                validate={value =>
                    value ? validateEmailWithMergeTags(value) : undefined
                }
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.email.bcc"
                label="BCC (optional)"
                onInsertFieldClick={onInsertFieldClick}
                helperText="Blind carbon copy recipients"
                validate={value =>
                    value ? validateEmailWithMergeTags(value) : undefined
                }
            />
        </Grid2>
    </Grid2>
);

const EmailContentFields: React.FC<{ onInsertFieldClick?: () => void }> = ({
    onInsertFieldClick,
}) => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
            <MergeTagTextField
                source="config.email.subject"
                label="Subject"
                onInsertFieldClick={onInsertFieldClick}
                helperText="Email subject line - supports merge tags"
                characterLimit={78}
                showCharacterCount={true}
                validate={validateSubjectLine}
            />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom>
                Email Body
            </Typography>
            <LexicalEditor
                source="config.email.bodyHtml"
                placeholder="Email content..."
                onInsertFieldClick={onInsertFieldClick}
                height={400}
                validate={required('Email body is required')}
            />
        </Grid2>
    </Grid2>
);

const EmailHeadersAttachmentsFields: React.FC = () => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
                Custom Headers
            </Typography>
            <KeyValueEditor source="config.email.headers" />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
            <ContentSelector
                source="config.email.attachments"
                label="Email Attachments"
                helperText="Select files from content library to attach to emails. Supported formats: PDF, DOC, XLS, images, etc."
                accept="*/*"
                multiple={true}
            />
        </Grid2>
    </Grid2>
);

// Text/SMS Components
const TextBasicFields: React.FC<{ onInsertFieldClick?: () => void }> = ({
    onInsertFieldClick,
}) => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.text.from"
                label="From Number"
                onInsertFieldClick={onInsertFieldClick}
                helperText="Twilio phone number (e.g., +15551234567)"
                validate={validatePhoneNumber}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <MergeTagTextField
                source="config.text.to"
                label="To Number (supports merge tags)"
                onInsertFieldClick={onInsertFieldClick}
                helperText="Use merge tags like {record.phone}"
                validate={validatePhoneNumber}
            />
        </Grid2>
    </Grid2>
);

const TextContentFields: React.FC<{ onInsertFieldClick?: () => void }> = ({
    onInsertFieldClick,
}) => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
            <MergeTagTextField
                source="config.text.message"
                label="Message"
                multiline
                rows={4}
                onInsertFieldClick={onInsertFieldClick}
                helperText="SMS message content - supports merge tags"
                showCharacterCount={true}
                validate={validateSmsMessage}
            />
        </Grid2>
    </Grid2>
);

const TextMediaFields: React.FC = () => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
            <ContentSelector
                source="config.text.media"
                label="Media Attachments (MMS)"
                helperText="Add images, videos, or audio files to send as MMS. Max 5MB per file. Supported: JPEG, PNG, GIF, MP4, MP3."
                accept="image/*,video/*,audio/*"
                multiple={true}
            />
        </Grid2>
    </Grid2>
);

// API Components
const ApiBasicFields: React.FC<{ onInsertFieldClick?: () => void }> = ({
    onInsertFieldClick,
}) => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 3 }}>
            <SelectInput
                source="config.api.method"
                choices={[
                    { id: 'GET', name: 'GET' },
                    { id: 'POST', name: 'POST' },
                    { id: 'PUT', name: 'PUT' },
                    { id: 'PATCH', name: 'PATCH' },
                    { id: 'DELETE', name: 'DELETE' },
                ]}
                defaultValue="POST"
                validate={required('HTTP method is required')}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 9 }}>
            <MergeTagTextField
                source="config.api.url"
                label="URL (supports merge tags)"
                onInsertFieldClick={onInsertFieldClick}
                helperText="API endpoint URL - supports merge tags in path and query params"
                validate={validateUrl}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <TextInput
                source="config.api.timeout"
                label="Timeout (seconds)"
                type="number"
                defaultValue={30}
                validate={validateTimeout}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
            <TextInput
                source="config.api.retries"
                label="Max Retries"
                type="number"
                defaultValue={3}
                validate={validateRetries}
            />
        </Grid2>
    </Grid2>
);

const ApiRequestFields: React.FC<{ onInsertFieldClick?: () => void }> = ({
    onInsertFieldClick,
}) => (
    <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
                Headers
            </Typography>
            <KeyValueEditor source="config.api.headers" />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
                Query Parameters
            </Typography>
            <KeyValueEditor source="config.api.query" />
        </Grid2>
    </Grid2>
);

const ApiAuthFields: React.FC = () => {
    const { watch } = useFormContext();
    const authType = watch('config.api.auth.type') || 'none';

    return (
        <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <SelectInput
                    source="config.api.auth.type"
                    label="Authentication Type"
                    choices={[
                        { id: 'none', name: 'None' },
                        { id: 'bearer', name: 'Bearer Token' },
                        { id: 'basic', name: 'Basic Auth' },
                        { id: 'apikey', name: 'API Key' },
                    ]}
                    defaultValue="none"
                    validate={required('Authentication type is required')}
                />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <TextInput
                    source="config.api.auth.token"
                    label="Token/Key"
                    fullWidth
                    validate={
                        authType !== 'none'
                            ? [
                                  required(
                                      'Token/Key is required when authentication is enabled'
                                  ),
                                  minLength(1, 'Token cannot be empty'),
                              ]
                            : undefined
                    }
                />
            </Grid2>
            {authType === 'basic' && (
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        source="config.api.auth.username"
                        label="Username"
                        fullWidth
                        validate={[
                            required('Username is required for basic auth'),
                            minLength(1, 'Username cannot be empty'),
                        ]}
                    />
                </Grid2>
            )}
        </Grid2>
    );
};

const ApiBodyFields: React.FC<{ onInsertFieldClick?: () => void }> = ({
    onInsertFieldClick,
}) => {
    const { watch } = useFormContext();
    const bodyType = watch('config.api.bodyType') || 'json';
    const httpMethod = watch('config.api.method') || 'POST';

    // Methods that typically don't have bodies
    const methodsWithoutBody = ['GET', 'HEAD', 'DELETE'];
    const shouldValidateBody = !methodsWithoutBody.includes(httpMethod);

    const getBodyValidation = () => {
        if (!shouldValidateBody) return undefined;

        if (bodyType === 'json') {
            return validateJson;
        }
        return undefined; // No validation for form data or raw text
    };

    return (
        <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <SelectInput
                    source="config.api.bodyType"
                    label="Body Type"
                    choices={[
                        { id: 'json', name: 'JSON' },
                        { id: 'form', name: 'Form Data' },
                        { id: 'raw', name: 'Raw Text' },
                    ]}
                    defaultValue="json"
                    validate={
                        shouldValidateBody
                            ? required('Body type is required')
                            : undefined
                    }
                />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
                <MergeTagTextField
                    source="config.api.body"
                    label="Request Body (supports merge tags)"
                    multiline
                    rows={8}
                    onInsertFieldClick={onInsertFieldClick}
                    helperText={
                        shouldValidateBody
                            ? `Request body template - supports merge tags like {record.id}. ${
                                  bodyType === 'json'
                                      ? 'Must be valid JSON when not using merge tags.'
                                      : ''
                              }`
                            : `Request body is typically not used with ${httpMethod} requests`
                    }
                    placeholder={
                        bodyType === 'json'
                            ? '{"id": "{record.id}", "name": "{record.name}"}'
                            : 'Request body content...'
                    }
                    validate={getBodyValidation()}
                />
            </Grid2>
        </Grid2>
    );
};

// Utility component for key-value editing
const KeyValueEditor: React.FC<{ source: string }> = ({ source }) => {
    const { field } = useInput({ source });
    const [pairs, setPairs] = useState<Array<{ key: string; value: string }>>(
        []
    );

    React.useEffect(() => {
        if (field.value && typeof field.value === 'object') {
            setPairs(
                Object.entries(field.value).map(([key, value]) => ({
                    key,
                    value: String(value),
                }))
            );
        }
    }, [field.value]);

    const addPair = () => {
        setPairs([...pairs, { key: '', value: '' }]);
    };

    const updatePair = (index: number, key: string, value: string) => {
        const newPairs = [...pairs];
        newPairs[index] = { key, value };
        setPairs(newPairs);

        // Update form
        const obj = newPairs.reduce((acc, pair) => {
            if (pair.key.trim()) {
                acc[pair.key] = pair.value;
            }
            return acc;
        }, {} as Record<string, string>);
        field.onChange(obj);
    };

    const removePair = (index: number) => {
        const newPairs = pairs.filter((_, i) => i !== index);
        setPairs(newPairs);

        // Update form
        const obj = newPairs.reduce((acc, pair) => {
            if (pair.key.trim()) {
                acc[pair.key] = pair.value;
            }
            return acc;
        }, {} as Record<string, string>);
        field.onChange(obj);
    };

    return (
        <Box>
            <List>
                {pairs.map((pair, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                        <Grid2
                            container
                            spacing={2}
                            sx={{ width: '100%', alignItems: 'center' }}
                        >
                            <Grid2 size={{ xs: 5 }}>
                                <TextField
                                    label="Key"
                                    value={pair.key}
                                    onChange={e =>
                                        updatePair(
                                            index,
                                            e.target.value,
                                            pair.value
                                        )
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 6 }}>
                                <TextField
                                    label="Value"
                                    value={pair.value}
                                    onChange={e =>
                                        updatePair(
                                            index,
                                            pair.key,
                                            e.target.value
                                        )
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 1 }}>
                                <IconButton
                                    onClick={() => removePair(index)}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid2>
                        </Grid2>
                    </ListItem>
                ))}
            </List>
            <Button onClick={addPair} startIcon={<AddIcon />} size="small">
                Add Header
            </Button>
        </Box>
    );
};

export default SubscriberFormFields;
