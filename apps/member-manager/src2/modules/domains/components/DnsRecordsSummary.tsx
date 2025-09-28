import {
    Add as AddIcon,
    CheckCircle as CheckIcon,
    Dns as DnsIcon,
    Language as LanguageIcon,
    Mail as MailIcon,
    Security as SecurityIcon,
    Storage as StorageIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    Badge,
    Box,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

export const DnsRecordsSummary = () => {
    const record = useRecordContext();

    if (!record) return null;

    const recordCounts = {
        A: record.aRecords?.length || 0,
        CNAME: record.cnameRecords?.length || 0,
        MX: record.mxRecords?.length || 0,
        TXT: record.txtRecords?.length || 0,
        NS: record.nsRecords?.length || 0,
    };

    const totalRecords = Object.values(recordCounts).reduce(
        (sum, count) => sum + count,
        0
    );

    // DNS health assessment
    const hasBasicRecords = recordCounts.A > 0 || recordCounts.CNAME > 0;
    const hasMailSetup = recordCounts.MX > 0;
    const hasSecurityRecords = recordCounts.TXT > 0; // Often used for SPF, DKIM, etc.
    const hasNameservers = recordCounts.NS > 0;

    const healthScore = [
        hasBasicRecords,
        hasMailSetup,
        hasSecurityRecords,
        hasNameservers,
    ].filter(Boolean).length;
    const maxScore = 4;

    let healthColor: 'success' | 'warning' | 'error' | 'default';
    let healthIcon: React.ReactNode;
    let healthLabel: string;

    if (healthScore >= 3) {
        healthColor = 'success';
        healthIcon = <CheckIcon fontSize="small" />;
        healthLabel = 'Healthy';
    } else if (healthScore >= 2) {
        healthColor = 'warning';
        healthIcon = <WarningIcon fontSize="small" />;
        healthLabel = 'Basic';
    } else if (healthScore >= 1) {
        healthColor = 'error';
        healthIcon = <WarningIcon fontSize="small" />;
        healthLabel = 'Limited';
    } else {
        healthColor = 'default';
        healthIcon = <DnsIcon fontSize="small" />;
        healthLabel = 'None';
    }

    const getRecordIcon = (type: string) => {
        switch (type) {
            case 'A':
            case 'CNAME':
                return <LanguageIcon fontSize="small" />;
            case 'MX':
                return <MailIcon fontSize="small" />;
            case 'TXT':
                return <SecurityIcon fontSize="small" />;
            case 'NS':
                return <StorageIcon fontSize="small" />;
            default:
                return <DnsIcon fontSize="small" />;
        }
    };

    const getRecordDescription = (type: string) => {
        switch (type) {
            case 'A':
                return 'IPv4 address mappings';
            case 'CNAME':
                return 'Domain aliases';
            case 'MX':
                return 'Mail server routing';
            case 'TXT':
                return 'Text records (SPF, DKIM, etc.)';
            case 'NS':
                return 'Name servers';
            default:
                return '';
        }
    };

    const tooltipContent = (
        <Box sx={{ minWidth: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                DNS Configuration Details
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Health Score: {healthScore}/{maxScore} ({healthLabel})
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    {[
                        hasBasicRecords,
                        hasMailSetup,
                        hasSecurityRecords,
                        hasNameservers,
                    ].map((status, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: status
                                    ? 'success.main'
                                    : 'grey.300',
                            }}
                        />
                    ))}
                </Box>
            </Box>

            <Stack spacing={1}>
                {Object.entries(recordCounts).map(([type, count]) => (
                    <Box
                        key={type}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        {getRecordIcon(type)}
                        <Typography
                            variant="caption"
                            sx={{ fontWeight: 'bold', minWidth: 40 }}
                        >
                            {type}:
                        </Typography>
                        <Typography variant="caption">
                            {count} {count === 1 ? 'record' : 'records'}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                        >
                            ({getRecordDescription(type)})
                        </Typography>
                    </Box>
                ))}
            </Stack>

            {totalRecords === 0 && (
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        mt: 1,
                        display: 'block',
                    }}
                >
                    No DNS records configured. Click to add records.
                </Typography>
            )}

            <Box
                sx={{
                    mt: 2,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Quick Actions:
                </Typography>
                <Typography
                    variant="caption"
                    sx={{ display: 'block', mt: 0.5 }}
                >
                    • Click to edit DNS records • Basic setup needs A or CNAME
                    records • Add MX records for email • Use TXT records for
                    domain verification
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Tooltip title={tooltipContent} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge
                    badgeContent={totalRecords > 0 ? totalRecords : '!'}
                    color={totalRecords > 0 ? 'primary' : 'error'}
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.6rem',
                            height: 16,
                            minWidth: 16,
                        },
                    }}
                >
                    <Chip
                        icon={healthIcon}
                        label={`DNS ${healthLabel}`}
                        size="small"
                        variant="outlined"
                        color={healthColor}
                        sx={{
                            cursor: 'help',
                            '& .MuiChip-icon': {
                                marginLeft: '8px',
                            },
                        }}
                    />
                </Badge>

                {totalRecords === 0 && (
                    <IconButton
                        size="small"
                        sx={{
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: `primary.light20`,
                            },
                        }}
                        title="Add DNS records"
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </Tooltip>
    );
};
