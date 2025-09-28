import { CheckCircle, Error, Info, Warning } from '@mui/icons-material';
import { Box, Chip, LinearProgress, Tooltip, Typography } from '@mui/material';
import { useRecordContext } from 'react-admin';

export const DomainStatusField = () => {
    const record = useRecordContext();

    if (!record) return null;

    const hasUrl = Boolean(record.url);
    const hasTechnology = Boolean(record.technology);
    const hasServer = Boolean(record.serverId);
    const hasOrganization = Boolean(record.organizationId);
    const hasDnsRecords = Boolean(
        record.aRecords?.length ||
            record.cnameRecords?.length ||
            record.mxRecords?.length ||
            record.txtRecords?.length ||
            record.nsRecords?.length
    );

    const configurationItems = [
        { label: 'URL', value: hasUrl, required: true },
        { label: 'Technology', value: hasTechnology, required: true },
        { label: 'Server', value: hasServer, required: false },
        { label: 'Organization', value: hasOrganization, required: false },
        { label: 'DNS Records', value: hasDnsRecords, required: false },
    ];

    const requiredItems = configurationItems.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => item.value).length;
    const totalRequired = requiredItems.length;

    const completedOptional = configurationItems.filter(
        item => !item.required && item.value
    ).length;
    const totalOptional = configurationItems.filter(
        item => !item.required
    ).length;

    const progress =
        ((completedRequired + completedOptional) / configurationItems.length) *
        100;

    let color: 'success' | 'warning' | 'error' | 'info';
    let icon: React.ReactNode;
    let label: string;

    if (completedRequired === totalRequired) {
        if (completedOptional === totalOptional) {
            color = 'success';
            icon = <CheckCircle fontSize="small" />;
            label = 'Complete';
        } else {
            color = 'info';
            icon = <Info fontSize="small" />;
            label = 'Functional';
        }
    } else if (completedRequired > 0) {
        color = 'warning';
        icon = <Warning fontSize="small" />;
        label = 'Incomplete';
    } else {
        color = 'error';
        icon = <Error fontSize="small" />;
        label = 'Not Configured';
    }

    const tooltipContent = (
        <Box sx={{ minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Configuration Status
            </Typography>
            <Box sx={{ mb: 1 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 6, borderRadius: 3 }}
                />
                <Typography
                    variant="caption"
                    sx={{ mt: 0.5, display: 'block' }}
                >
                    {Math.round(progress)}% Complete
                </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Required ({completedRequired}/{totalRequired}):
                </Typography>
                {requiredItems.map((item, index) => (
                    <Typography
                        key={index}
                        variant="caption"
                        sx={{ display: 'block', ml: 1 }}
                    >
                        {item.value ? '✓' : '✗'} {item.label}
                    </Typography>
                ))}
                <Typography
                    variant="caption"
                    sx={{ fontWeight: 'bold', mt: 1, display: 'block' }}
                >
                    Optional ({completedOptional}/{totalOptional}):
                </Typography>
                {configurationItems
                    .filter(item => !item.required)
                    .map((item, index) => (
                        <Typography
                            key={index}
                            variant="caption"
                            sx={{ display: 'block', ml: 1 }}
                        >
                            {item.value ? '✓' : '✗'} {item.label}
                        </Typography>
                    ))}
            </Box>
        </Box>
    );

    return (
        <Tooltip title={tooltipContent} arrow>
            <Chip
                icon={icon}
                label={label}
                color={color}
                size="small"
                variant="outlined"
                sx={{
                    cursor: 'help',
                    '& .MuiChip-icon': {
                        marginLeft: '8px',
                    },
                }}
            />
        </Tooltip>
    );
};
