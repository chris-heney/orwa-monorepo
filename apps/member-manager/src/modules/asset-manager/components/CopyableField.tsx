import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { Box, IconButton, TextField, Tooltip, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { CopyableFieldProps } from '../types';

const CopyableField: React.FC<CopyableFieldProps> = ({
    value,
    type,
    copyToClipboard,
}) => {
    const [copied, setCopied] = useState(false);
    const theme = useTheme();

    const handleCopy = () => {
        copyToClipboard(value, type);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
                value={value}
                size="small"
                variant="outlined"
                InputProps={{
                    readOnly: true,
                    style: {
                        fontSize: '0.875rem',
                        fontFamily: 'monospace',
                    },
                }}
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? '#1e1e1e'
                                : '#f8f9fa',
                        transition: 'all 0.2s ease-in-out',
                        '& fieldset': {
                            borderColor:
                                theme.palette.mode === 'dark'
                                    ? '#333'
                                    : '#e0e0e0',
                        },
                        '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                        },
                    },
                    '& .MuiInputBase-input': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }}
            />
            <Tooltip title={copied ? `${type} copied!` : `Copy ${type}`}>
                <IconButton
                    onClick={handleCopy}
                    size="small"
                    sx={{
                        color: copied ? 'success.main' : 'primary.main',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: copied
                                ? 'rgba(46, 125, 50, 0.08)'
                                : 'rgba(25, 118, 210, 0.08)',
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <CopyIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default CopyableField;
