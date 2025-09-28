import React from 'react';
import { Chip, Tooltip, Box, Typography } from '@mui/material';
import { 
    CheckCircle as ActiveIcon, 
    Cancel as InactiveIcon,
    Schedule as PendingIcon 
} from '@mui/icons-material';
import { useRecordContext } from 'react-admin';

export const SubscriberStatusField = () => {
    const record = useRecordContext();

    if (!record) return null;

    const isActive = Boolean(record.isActive);
    const type: string = record.type;
    const hasValidType = type === 'EMAIL' || type === 'TEXT' || type === 'API';
    const config = record.config || {};

    // Determine completeness based on type-specific required fields from the new form
    const isEmailComplete = () => {
        const email = config.email || {};
        const hasTo = Boolean(email.to && String(email.to).trim());
        const hasSubject = Boolean(email.subject && String(email.subject).trim());
        const hasBody = Boolean(email.bodyHtml && String(email.bodyHtml).trim());
        return hasTo && hasSubject && hasBody;
    };

    const isTextComplete = () => {
        const text = config.text || {};
        const hasTo = Boolean(text.to && String(text.to).trim());
        const hasMessage = Boolean(text.message && String(text.message).trim());
        return hasTo && hasMessage;
    };

    const isApiComplete = () => {
        const api = config.api || {};
        const hasUrl = Boolean(api.url && String(api.url).trim());
        const hasMethod = Boolean(api.method && String(api.method).trim());
        return hasUrl && hasMethod;
    };

    const isConfigComplete = type === 'EMAIL' ? isEmailComplete() : type === 'TEXT' ? isTextComplete() : type === 'API' ? isApiComplete() : false;

    // Determine status based on configuration
    let status: 'active' | 'inactive' | 'pending';
    let color: 'success' | 'error' | 'warning';
    let icon: React.ReactNode;
    let label: string;

    if (isActive && hasValidType && isConfigComplete) {
        status = 'active';
        color = 'success';
        icon = <ActiveIcon fontSize="small" />;
        label = 'Active';
    } else if (!isActive) {
        status = 'inactive';
        color = 'error';
        icon = <InactiveIcon fontSize="small" />;
        label = 'Inactive';
    } else {
        status = 'pending';
        color = 'warning';
        icon = <PendingIcon fontSize="small" />;
        label = 'Incomplete';
    }

    const tooltipContent = (
        <Box sx={{ minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Subscriber Status Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption">
                    {isActive ? '✓' : '✗'} Active Status: {isActive ? 'Enabled' : 'Disabled'}
                </Typography>
                <Typography variant="caption">
                    {hasValidType ? '✓' : '✗'} Type: {hasValidType ? type : 'Not Set'}
                </Typography>
                {type === 'EMAIL' && (
                    <>
                        <Typography variant="caption">
                            {isEmailComplete() ? '✓' : '✗'} Email Config: {isEmailComplete() ? 'Complete' : 'Missing required fields (To, Subject, Body)'}
                        </Typography>
                    </>
                )}
                {type === 'TEXT' && (
                    <>
                        <Typography variant="caption">
                            {isTextComplete() ? '✓' : '✗'} SMS Config: {isTextComplete() ? 'Complete' : 'Missing required fields (To, Message)'}
                        </Typography>
                    </>
                )}
                {type === 'API' && (
                    <>
                        <Typography variant="caption">
                            {isApiComplete() ? '✓' : '✗'} API Config: {isApiComplete() ? 'Complete' : 'Missing required fields (Method, URL)'}
                        </Typography>
                    </>
                )}
            </Box>

            {status === 'pending' && (
                <Typography 
                    variant="caption" 
                    sx={{ 
                        mt: 1, 
                        display: 'block',
                        fontStyle: 'italic',
                        color: 'warning.main' 
                    }}
                >
                    Complete configuration to activate subscriber
                </Typography>
            )}
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
