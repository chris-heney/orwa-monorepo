import {
    ViewModule as AddonGroupIcon,
    Extension as AddonIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    Delete as DeleteIcon,
    FileCopy as DuplicateIcon,
    Edit as EditIcon,
    Star as FeatureIcon,
    Category as GroupIcon,
    Inventory as PackageIcon,
    Business as ServiceIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { RaRecord, ReferenceField, TextField } from 'react-admin';

// Mobile Core Service Card Component
export const MobileCoreServiceCard = ({
    record,
    onEdit,
    onDelete,
    onDuplicate,
    canEdit = true,
    canDelete = true,
    isSelected = false,
    onSelect,
}: {
    record: RaRecord;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    onDuplicate?: (record: RaRecord) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    isSelected?: boolean;
    onSelect?: (record: RaRecord) => void;
}) => {
    const theme = useTheme();

    if (!record) return null;

    const packageCount = record.packages?.length || 0;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                backgroundColor: isSelected
                    ? `${theme.palette.primary.main}08`
                    : theme.palette.background.paper,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.light,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
            onClick={() => onSelect?.(record)}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {/* Selection Indicator */}
                    {onSelect && (
                        <Box>
                            {isSelected ? (
                                <CheckBoxIcon color="primary" />
                            ) : (
                                <CheckBoxOutlineBlankIcon color="action" />
                            )}
                        </Box>
                    )}

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: 'primary.main',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                            fontSize: '1.5rem',
                        }}
                    >
                        <ServiceIcon fontSize="medium" />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                                label={`${packageCount} package${
                                    packageCount !== 1 ? 's' : ''
                                }`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 24,
                                    fontSize: '0.75rem',
                                    '& .MuiChip-label': {
                                        px: 1,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Description */}
                {record.description && (
                    <Box mb={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                            }}
                        >
                            {record.description}
                        </Typography>
                    </Box>
                )}

                {/* Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box />
                    <Box display="flex" gap={0.5}>
                        {canEdit && onDuplicate && (
                            <Tooltip title="Duplicate">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDuplicate(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.info.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.info.main}15`,
                                        },
                                    }}
                                >
                                    <DuplicateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && onEdit && (
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onEdit(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.primary.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}15`,
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canDelete && onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDelete(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.error.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.error.main}15`,
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Mobile Package Group Card Component
export const MobilePackageGroupCard = ({
    record,
    onEdit,
    onDelete,
    onDuplicate,
    canEdit = true,
    canDelete = true,
    isSelected = false,
    onSelect,
}: {
    record: RaRecord;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    onDuplicate?: (record: RaRecord) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    isSelected?: boolean;
    onSelect?: (record: RaRecord) => void;
}) => {
    const theme = useTheme();

    if (!record) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                backgroundColor: isSelected
                    ? `${theme.palette.primary.main}08`
                    : theme.palette.background.paper,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.light,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
            onClick={() => onSelect?.(record)}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {/* Selection Indicator */}
                    {onSelect && (
                        <Box>
                            {isSelected ? (
                                <CheckBoxIcon color="primary" />
                            ) : (
                                <CheckBoxOutlineBlankIcon color="action" />
                            )}
                        </Box>
                    )}

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: 'secondary.main',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        <GroupIcon fontSize="medium" />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                        >
                            {record.revenueMin && record.revenueMax && (
                                <Chip
                                    label={`$${record.revenueMin?.toLocaleString()} - $${record.revenueMax?.toLocaleString()}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Description */}
                {record.description && (
                    <Box mb={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                            }}
                        >
                            {record.description}
                        </Typography>
                    </Box>
                )}

                {/* Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box />
                    <Box display="flex" gap={0.5}>
                        {canEdit && onDuplicate && (
                            <Tooltip title="Duplicate">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDuplicate(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.info.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.info.main}15`,
                                        },
                                    }}
                                >
                                    <DuplicateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && onEdit && (
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onEdit(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.primary.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}15`,
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canDelete && onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDelete(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.error.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.error.main}15`,
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Mobile Package Card Component
export const MobilePackageCard = ({
    record,
    onEdit,
    onDelete,
    onDuplicate,
    canEdit = true,
    canDelete = true,
    isSelected = false,
    onSelect,
}: {
    record: RaRecord;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    onDuplicate?: (record: RaRecord) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    isSelected?: boolean;
    onSelect?: (record: RaRecord) => void;
}) => {
    const theme = useTheme();

    if (!record) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                backgroundColor: isSelected
                    ? `${theme.palette.primary.main}08`
                    : theme.palette.background.paper,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.light,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
            onClick={() => onSelect?.(record)}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {/* Selection Indicator */}
                    {onSelect && (
                        <Box>
                            {isSelected ? (
                                <CheckBoxIcon color="primary" />
                            ) : (
                                <CheckBoxOutlineBlankIcon color="action" />
                            )}
                        </Box>
                    )}

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: 'success.main',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        <PackageIcon fontSize="medium" />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                        >
                            {record.investmentSetup > 0 && (
                                <Chip
                                    label={`Setup: $${record.investmentSetup?.toLocaleString()}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                            {record.investmentRecurring > 0 && (
                                <Chip
                                    label={`$${record.investmentRecurring?.toLocaleString()}/${record.investmentFrequency?.toLowerCase()}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Description */}
                {record.description && (
                    <Box mb={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                            }}
                        >
                            {record.description}
                        </Typography>
                    </Box>
                )}

                {/* Package Group */}
                {record.packageGroupId && (
                    <Box mb={2}>
                        <ReferenceField
                            source="packageGroupId"
                            reference="package-group"
                            record={record}
                            link={false}
                        >
                            <Chip
                                label={<TextField source="name" />}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    '& .MuiChip-label': {
                                        px: 1,
                                    },
                                }}
                            />
                        </ReferenceField>
                    </Box>
                )}

                {/* Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box />
                    <Box display="flex" gap={0.5}>
                        {canEdit && onDuplicate && (
                            <Tooltip title="Duplicate">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDuplicate(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.info.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.info.main}15`,
                                        },
                                    }}
                                >
                                    <DuplicateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && onEdit && (
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onEdit(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.primary.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}15`,
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canDelete && onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDelete(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.error.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.error.main}15`,
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Mobile Feature Card Component
export const MobileFeatureCard = ({
    record,
    onEdit,
    onDelete,
    onDuplicate,
    canEdit = true,
    canDelete = true,
    isSelected = false,
    onSelect,
}: {
    record: RaRecord;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    onDuplicate?: (record: RaRecord) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    isSelected?: boolean;
    onSelect?: (record: RaRecord) => void;
}) => {
    const theme = useTheme();

    if (!record) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                backgroundColor: isSelected
                    ? `${theme.palette.primary.main}08`
                    : theme.palette.background.paper,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.light,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
            onClick={() => onSelect?.(record)}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {/* Selection Indicator */}
                    {onSelect && (
                        <Box>
                            {isSelected ? (
                                <CheckBoxIcon color="primary" />
                            ) : (
                                <CheckBoxOutlineBlankIcon color="action" />
                            )}
                        </Box>
                    )}

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: 'warning.main',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        <FeatureIcon fontSize="medium" />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                    </Box>
                </Box>

                {/* Description */}
                {record.description && (
                    <Box mb={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                            }}
                        >
                            {record.description}
                        </Typography>
                    </Box>
                )}

                {/* Packages */}
                {record.packages && record.packages.length > 0 && (
                    <Box mb={2}>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                            {record.packages.slice(0, 3).map((pkg: any) => (
                                <Chip
                                    key={pkg.id}
                                    label={pkg.name}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            ))}
                            {record.packages.length > 3 && (
                                <Chip
                                    label={`+${
                                        record.packages.length - 3
                                    } more`}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                )}

                {/* Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box />
                    <Box display="flex" gap={0.5}>
                        {canEdit && onDuplicate && (
                            <Tooltip title="Duplicate">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDuplicate(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.info.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.info.main}15`,
                                        },
                                    }}
                                >
                                    <DuplicateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && onEdit && (
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onEdit(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.primary.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}15`,
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canDelete && onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDelete(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.error.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.error.main}15`,
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Mobile Addon Group Card Component
export const MobileAddonGroupCard = ({
    record,
    onEdit,
    onDelete,
    onDuplicate,
    canEdit = true,
    canDelete = true,
    isSelected = false,
    onSelect,
}: {
    record: RaRecord;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    onDuplicate?: (record: RaRecord) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    isSelected?: boolean;
    onSelect?: (record: RaRecord) => void;
}) => {
    const theme = useTheme();

    if (!record) return null;

    const addonCount = record.addons?.length || 0;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                backgroundColor: isSelected
                    ? `${theme.palette.primary.main}08`
                    : theme.palette.background.paper,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.light,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
            onClick={() => onSelect?.(record)}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {/* Selection Indicator */}
                    {onSelect && (
                        <Box>
                            {isSelected ? (
                                <CheckBoxIcon color="primary" />
                            ) : (
                                <CheckBoxOutlineBlankIcon color="action" />
                            )}
                        </Box>
                    )}

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: 'info.main',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        <AddonGroupIcon fontSize="medium" />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                                label={`${addonCount} addon${
                                    addonCount !== 1 ? 's' : ''
                                }`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 24,
                                    fontSize: '0.75rem',
                                    '& .MuiChip-label': {
                                        px: 1,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Description */}
                {record.description && (
                    <Box mb={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                            }}
                        >
                            {record.description}
                        </Typography>
                    </Box>
                )}

                {/* Addons */}
                {record.addons && record.addons.length > 0 && (
                    <Box mb={2}>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                            {record.addons.slice(0, 3).map((addon: any) => (
                                <Chip
                                    key={addon.id}
                                    label={addon.name}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            ))}
                            {record.addons.length > 3 && (
                                <Chip
                                    label={`+${record.addons.length - 3} more`}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                )}

                {/* Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box />
                    <Box display="flex" gap={0.5}>
                        {canEdit && onDuplicate && (
                            <Tooltip title="Duplicate">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDuplicate(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.info.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.info.main}15`,
                                        },
                                    }}
                                >
                                    <DuplicateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && onEdit && (
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onEdit(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.primary.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}15`,
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canDelete && onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDelete(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.error.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.error.main}15`,
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Mobile Addon Card Component
export const MobileAddonCard = ({
    record,
    onEdit,
    onDelete,
    onDuplicate,
    canEdit = true,
    canDelete = true,
    isSelected = false,
    onSelect,
}: {
    record: RaRecord;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    onDuplicate?: (record: RaRecord) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    isSelected?: boolean;
    onSelect?: (record: RaRecord) => void;
}) => {
    const theme = useTheme();

    if (!record) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                backgroundColor: isSelected
                    ? `${theme.palette.primary.main}08`
                    : theme.palette.background.paper,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.light,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
            onClick={() => onSelect?.(record)}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {/* Selection Indicator */}
                    {onSelect && (
                        <Box>
                            {isSelected ? (
                                <CheckBoxIcon color="primary" />
                            ) : (
                                <CheckBoxOutlineBlankIcon color="action" />
                            )}
                        </Box>
                    )}

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: 'error.main',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        <AddonIcon fontSize="medium" />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                        >
                            {record.investmentSetup > 0 && (
                                <Chip
                                    label={`Setup: $${record.investmentSetup?.toLocaleString()}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                            {record.investmentRecurring > 0 && (
                                <Chip
                                    label={`$${record.investmentRecurring?.toLocaleString()}/${record.investmentFrequency?.toLowerCase()}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                            {record.investmentEa > 0 && (
                                <Chip
                                    label={`$${record.investmentEa?.toLocaleString()}/ea`}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Description */}
                {record.description && (
                    <Box mb={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                            }}
                        >
                            {record.description}
                        </Typography>
                    </Box>
                )}

                {/* Addon Groups */}
                {record.addonGroup && record.addonGroup.length > 0 && (
                    <Box mb={2}>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                            {record.addonGroup.slice(0, 3).map((group: any) => (
                                <Chip
                                    key={group.id}
                                    label={group.name}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            ))}
                            {record.addonGroup.length > 3 && (
                                <Chip
                                    label={`+${
                                        record.addonGroup.length - 3
                                    } more`}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        '& .MuiChip-label': {
                                            px: 1,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                )}

                {/* Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box />
                    <Box display="flex" gap={0.5}>
                        {canEdit && onDuplicate && (
                            <Tooltip title="Duplicate">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDuplicate(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.info.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.info.main}15`,
                                        },
                                    }}
                                >
                                    <DuplicateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canEdit && onEdit && (
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onEdit(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.primary.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.primary.main}15`,
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canDelete && onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDelete(record);
                                    }}
                                    sx={{
                                        bgcolor: `${theme.palette.error.main}08`,
                                        '&:hover': {
                                            bgcolor: `${theme.palette.error.main}15`,
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
