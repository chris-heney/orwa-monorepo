import {
    CheckCircle as ActiveIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    Code as CodeIcon,
    Delete as DeleteIcon,
    FileCopy as DuplicateIcon,
    Edit as EditIcon,
    Block as InactiveIcon,
    Layers as LayersIcon,
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

// Mobile Platform Group Card Component
export const MobilePlatformGroupCard = ({
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

    const isActive = record.isActive;
    const platformCount = record.platforms?.length || 0;

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
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
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
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
                                bgcolor: isActive ? 'primary.main' : 'grey.400',
                                border: `2px solid ${theme.palette.background.paper}`,
                                boxShadow: theme.shadows[2],
                                fontSize: '1.5rem',
                            }}
                        >
                            {record.icon || <CodeIcon fontSize="medium" />}
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
                                {record.title}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Chip
                                    icon={
                                        isActive ? (
                                            <ActiveIcon />
                                        ) : (
                                            <InactiveIcon />
                                        )
                                    }
                                    label={isActive ? 'Active' : 'Inactive'}
                                    size="small"
                                    color={isActive ? 'success' : 'default'}
                                    variant="outlined"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            width: 14,
                                            height: 14,
                                        },
                                    }}
                                />
                                <Chip
                                    label={`${platformCount} platform${
                                        platformCount !== 1 ? 's' : ''
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

                    {/* Purpose/Description */}
                    {record.purpose && (
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
                                {record.purpose}
                            </Typography>
                        </Box>
                    )}

                    {/* Sort Order */}
                    {record.sortOrder !== undefined && (
                        <Box mb={2}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Sort Order: {record.sortOrder}
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
        </Box>
    );
};

// Mobile Platform Card Component
export const MobilePlatformCard = ({
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

    const isActive = record.isActive;

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
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
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
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
                                bgcolor: isActive
                                    ? 'secondary.main'
                                    : 'grey.400',
                                border: `2px solid ${theme.palette.background.paper}`,
                                boxShadow: theme.shadows[2],
                            }}
                        >
                            <LayersIcon fontSize="medium" />
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
                                    icon={
                                        isActive ? (
                                            <ActiveIcon />
                                        ) : (
                                            <InactiveIcon />
                                        )
                                    }
                                    label={isActive ? 'Active' : 'Inactive'}
                                    size="small"
                                    color={isActive ? 'success' : 'default'}
                                    variant="outlined"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            width: 14,
                                            height: 14,
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

                    {/* Platform Group */}
                    {record.platformGroup && (
                        <Box mb={2}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Group: {record.platformGroup.title}
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
        </Box>
    );
};