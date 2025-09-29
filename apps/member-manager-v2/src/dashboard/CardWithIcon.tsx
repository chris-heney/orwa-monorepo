import * as React from 'react';
import { FC, createElement, ReactNode } from 'react';
import { Card, Box, Typography, Divider, useTheme, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
    icon: FC<any>;
    to: string;
    title?: string;
    subtitle?: string | number;
    children?: ReactNode;
}

const CardWithIcon = (props: Props) => {
    const { icon, title, subtitle, to, children } = props;
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 2,
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}20`,
                    transform: 'translateY(-4px)',
                    borderColor: theme.palette.primary.main,
                    '& .icon-container': {
                        transform: 'scale(1.1)',
                    },
                },
                '& a': {
                    textDecoration: 'none',
                    color: 'inherit',
                },
            }}
        >
            <Link to={to}>
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        className="icon-container"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                            transition: 'transform 0.3s ease-in-out',
                        }}
                    >
                        {createElement(icon, { fontSize: 'medium' })}
                    </Box>

                    <Box textAlign="left">
                        <Typography color="textSecondary" variant="body2">
                            {title}
                        </Typography>
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mt: 0.5,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {subtitle || ' '}
                        </Typography>
                    </Box>
                </Box>
            </Link>

            {children && (
                <>
                    <Divider sx={{ mx: 2 }} />
                    <Box sx={{ p: 2, flexGrow: 1 }}>{children}</Box>
                </>
            )}
        </Card>
    );
};

export default CardWithIcon;
