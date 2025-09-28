import { 
    Box, 
    Chip, 
    Stack, 
    Tooltip, 
    Typography 
} from '@mui/material';
import { 
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon 
} from '@mui/icons-material';
import { useRecordContext } from 'react-admin';

interface AppStatusFieldProps {
    showDetails?: boolean;
}

export const AppStatusField = ({ showDetails = false }: AppStatusFieldProps) => {
    const record = useRecordContext();

    if (!record) return null;

    const hasName = Boolean(record.name);
    const hasUrl = Boolean(record.url);
    const hasDescription = Boolean(record.description);
    const hasCategory = Boolean(record.category);
    const hasIcon = Boolean(record.icon);
    const hasColor = Boolean(record.color);

    const configurationItems = [
        { label: 'Name', value: hasName, required: true },
        { label: 'URL', value: hasUrl, required: true },
        { label: 'Description', value: hasDescription, required: true },
        { label: 'Category', value: hasCategory, required: true },
        { label: 'Icon', value: hasIcon, required: false },
        { label: 'Color', value: hasColor, required: false },
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

    if (completedRequired === totalRequired && completedOptional === totalOptional) {
        color = 'success';
        icon = <CheckIcon fontSize="small" />;
        label = 'Complete';
    } else if (completedRequired === totalRequired) {
        color = 'info';
        icon = <InfoIcon fontSize="small" />;
        label = 'Basic Setup';
    } else if (completedRequired >= totalRequired / 2) {
        color = 'warning';
        icon = <WarningIcon fontSize="small" />;
        label = 'Incomplete';
    } else {
        color = 'error';
        icon = <ErrorIcon fontSize="small" />;
        label = 'Missing Info';
    }

    // Create tooltip content showing configuration details
    const tooltipContent = (
        <Stack spacing={0.5} p={1}>
            <Typography variant="subtitle2" fontWeight="bold">
                Configuration Status
            </Typography>
            <Box sx={{ width: '100%', mb: 1 }}>
                <Typography variant="caption" color="textSecondary">
                    Progress: {Math.round(progress)}%
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        height: 4,
                        bgcolor: 'grey.200',
                        borderRadius: 2,
                        mt: 0.5,
                    }}
                >
                    <Box
                        sx={{
                            width: `${progress}%`,
                            height: '100%',
                            bgcolor: `${color}.main`,
                            borderRadius: 2,
                        }}
                    />
                </Box>
            </Box>
            <Typography variant="caption" color="textSecondary">
                Required Fields ({completedRequired}/{totalRequired})
            </Typography>
            {requiredItems.map(item => (
                <Box
                    key={item.label}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    {item.value ? (
                        <CheckIcon
                            fontSize="small"
                            color="success"
                            sx={{ mr: 1 }}
                        />
                    ) : (
                        <ErrorIcon
                            fontSize="small"
                            color="error"
                            sx={{ mr: 1 }}
                        />
                    )}
                    <Typography variant="caption">{item.label}</Typography>
                </Box>
            ))}
            {totalOptional > 0 && (
                <>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                        Optional Fields ({completedOptional}/{totalOptional})
                    </Typography>
                    {configurationItems
                        .filter(item => !item.required)
                        .map(item => (
                            <Box
                                key={item.label}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                {item.value ? (
                                    <CheckIcon
                                        fontSize="small"
                                        color="success"
                                        sx={{ mr: 1 }}
                                    />
                                ) : (
                                    <InfoIcon
                                        fontSize="small"
                                        color="disabled"
                                        sx={{ mr: 1 }}
                                    />
                                )}
                                <Typography variant="caption">{item.label}</Typography>
                            </Box>
                        ))}
                </>
            )}
        </Stack>
    );

    return (
        <Tooltip
            title={tooltipContent}
            arrow
            placement="top"
            sx={{ maxWidth: 'none' }}
        >
            {showDetails ? (
                <Box>
                    <Chip
                        icon={icon}
                        label={label}
                        size="small"
                        color={color}
                        sx={{ 
                            fontWeight: 500, 
                            '& .MuiChip-icon': { 
                                ml: 0.5 
                            },
                            mb: 1
                        }}
                    />
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                            Progress: {Math.round(progress)}%
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                height: 4,
                                bgcolor: 'grey.200',
                                borderRadius: 2,
                                mt: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    bgcolor: `${color}.main`,
                                    borderRadius: 2,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Chip
                    icon={icon}
                    label={label}
                    size="small"
                    color={color}
                    sx={{ 
                        fontWeight: 500, 
                        '& .MuiChip-icon': { 
                            ml: 0.5 
                        } 
                    }}
                />
            )}
        </Tooltip>
    );
};
