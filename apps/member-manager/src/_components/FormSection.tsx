import * as React from 'react';
import { Card, CardContent, Box, Typography, Stack } from '@mui/material';

export const FormSection = ({ title, children, icon }: { 
    title: string; 
    children: React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <Card sx={{borderRadius: 0 }}>
        <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                {icon}
                <Typography variant="h6" color="primary">
                    {title}
                </Typography>
            </Box>
            <Stack spacing={2}>
                {children}
            </Stack>
        </CardContent>
    </Card>
);
