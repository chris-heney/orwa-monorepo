import {
    Apps as AppsIcon,
    Settings as ConfigIcon,
    Tune as TuneIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
    BooleanInput,
    NumberInput,
    SelectInput,
    TextInput,
    required,
    useInput,
    useRecordContext,
} from 'react-admin';
import { EmojiSelector } from './EmojiSelector';

// Custom EmojiInput component connected to react-admin form state
const EmojiInput = ({
    source = 'icon',
    category,
}: {
    source?: string;
    category?: string;
}) => {
    const {
        field: { value, onChange },
        fieldState: { error },
        isRequired,
    } = useInput({ source });
    return (
        <Box>
            <EmojiSelector
                value={value || '📱'}
                onChange={onChange}
                category={category}
            />
            {error && (
                <Typography variant="caption" color="error">
                    {error.message}
                </Typography>
            )}
        </Box>
    );
};

// Custom ColorInput component connected to react-admin form state
const ColorInput = ({
    source,
    fullWidth,
    helperText,
}: {
    source: string;
    fullWidth?: boolean;
    helperText?: string;
}) => {
    const {
        field: { value, onChange },
        fieldState: { error },
        isRequired,
    } = useInput({ source });

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ width: fullWidth ? '100%' : 'auto' }}
        >
            <TextField
                type="color"
                size="small"
                value={value || '#6C5CE7'}
                sx={{ width: 80, height: 40 }}
                onChange={e => onChange(e.target.value)}
            />
            <TextField
                fullWidth
                size="small"
                value={value || '#6C5CE7'}
                onChange={e => onChange(e.target.value)}
                helperText={error ? error.message : helperText}
                error={!!error}
                required={isRequired}
            />
        </Box>
    );
};

// Tab Configuration
const TabConfig = [
    {
        key: 'basic',
        label: 'Basic Information',
        shortLabel: 'Basic',
        icon: <AppsIcon />,
        component: BasicInformationTab,
        priority: 1,
    },
    {
        key: 'configuration',
        label: 'Configuration',
        shortLabel: 'Config',
        icon: <ConfigIcon />,
        component: ConfigurationTab,
        priority: 1,
    },
    {
        key: 'advanced',
        label: 'Advanced Settings',
        shortLabel: 'Advanced',
        icon: <TuneIcon />,
        component: AdvancedSettingsTab,
        priority: 2,
    },
];

// Custom hook for responsive tab management
const useResponsiveTabs = () => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const [currentTab, setCurrentTab] = useState(0);

    // Calculate how many tabs can be displayed based on screen size
    const visibleTabCount = isSmall ? 2 : TabConfig.length;

    // Sort tabs by priority
    const sortedTabs = [...TabConfig].sort((a, b) => a.priority - b.priority);

    // Get visible tabs
    const visibleTabs = sortedTabs.slice(0, visibleTabCount);

    return {
        currentTab,
        setCurrentTab,
        visibleTabs,
        isSmall,
        visibleTabCount,
        allTabs: sortedTabs,
    };
};

// Basic Information Tab Component
function BasicInformationTab() {
    const record = useRecordContext();
    const category = record?.category || '';

    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom>
                Basic App Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextInput
                        source="name"
                        fullWidth
                        validate={[required()]}
                        helperText="The name of the application"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextInput
                        source="url"
                        fullWidth
                        validate={[required()]}
                        type="url"
                        helperText="URL where the app can be accessed"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextInput
                        source="description"
                        fullWidth
                        multiline
                        rows={3}
                        validate={[required()]}
                        helperText="Brief description of what the app does"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <SelectInput
                        source="category"
                        validate={[required()]}
                        fullWidth
                        choices={[
                            { id: 'CONTENT', name: 'Content' },
                            { id: 'DESIGN', name: 'Design' },
                            { id: 'DEVELOPMENT', name: 'Development' },
                            { id: 'SUPPORT', name: 'Support' },
                            { id: 'MARKETING', name: 'Marketing' },
                            { id: 'ADMIN', name: 'Admin' },
                            { id: 'OTHER', name: 'Other' },
                        ]}
                        helperText="Category helps with organization and filtering"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 1 }}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                        >
                            App Icon
                        </Typography>
                        <EmojiInput source="icon" category={category} />
                        <TextInput
                            source="icon"
                            fullWidth
                            sx={{ display: 'none' }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

// Configuration Tab Component
function ConfigurationTab() {
    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom>
                App Configuration
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 1 }}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                        >
                            App Color
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            <ColorInput
                                source="color"
                                fullWidth
                                helperText="Hex color code (e.g., #6C5CE7)"
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <NumberInput
                        source="order"
                        fullWidth
                        defaultValue={1}
                        helperText="Display order in lists and dashboards"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ p: 1 }}>
                        <BooleanInput
                            source="isActive"
                            defaultValue={true}
                            helperText="Whether this app should be displayed to users"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

// Advanced Settings Tab Component
function AdvancedSettingsTab() {
    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom>
                Advanced Settings
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: 'background.default' }}
                    >
                        <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                        >
                            Integration Settings
                        </Typography>
                        <TextInput
                            source="apiKey"
                            fullWidth
                            helperText="API key for integration (if applicable)"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: 'background.default' }}
                    >
                        <Typography
                            variant="subtitle2"
                            color="error"
                            gutterBottom
                        >
                            Danger Zone
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            paragraph
                        >
                            Actions here can have permanent consequences. Please
                            proceed with caution.
                        </Typography>
                        <Box mt={2}>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                            >
                                Reset App Data
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

// Responsive Tab Menu Component
const ResponsiveTabMenu = ({
    tabs,
    currentTab,
    onTabChange,
    visibleCount,
}: {
    tabs: typeof TabConfig;
    currentTab: number;
    onTabChange: (index: number) => void;
    visibleCount: number;
}) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Tabs
            value={currentTab}
            onChange={(_, value) => onTabChange(value)}
            variant={isSmall ? 'fullWidth' : 'standard'}
            sx={{
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            {tabs.map((tab, index) => (
                <Tab
                    key={tab.key}
                    label={isSmall ? tab.shortLabel : tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    sx={{
                        minHeight: isSmall ? 48 : 72,
                        display: index < visibleCount ? 'flex' : 'none',
                    }}
                />
            ))}
        </Tabs>
    );
};

// Mobile Tab Navigation Component
const MobileTabNavigation = ({
    tabs,
    currentTab,
    onTabChange,
}: {
    tabs: typeof TabConfig;
    currentTab: number;
    onTabChange: (index: number) => void;
}) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                p: 1,
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            {tabs.map((tab, index) => (
                <Button
                    key={tab.key}
                    variant={currentTab === index ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={tab.icon}
                    onClick={() => onTabChange(index)}
                    sx={{
                        flexGrow: 1,
                        textTransform: 'none',
                    }}
                >
                    {tab.shortLabel}
                </Button>
            ))}
        </Stack>
    );
};

// Main Edit Context Component
const AppFormFields = () => {
    const {
        currentTab,
        setCurrentTab,
        visibleTabs,
        isSmall,
        visibleTabCount,
        allTabs,
    } = useResponsiveTabs();

    const TabContent = allTabs[currentTab].component;

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Box p={2}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    {allTabs[currentTab].label}
                </Typography>
                <Divider />
            </Box>

            {isSmall ? (
                <MobileTabNavigation
                    tabs={allTabs}
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                />
            ) : (
                <ResponsiveTabMenu
                    tabs={allTabs}
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                    visibleCount={visibleTabCount}
                />
            )}

            <Box sx={{ p: 1 }}>
                <TabContent />
            </Box>

            {/* Custom toolbar removed to avoid duplicate buttons */}
        </Box>
    );
};

export default AppFormFields;
