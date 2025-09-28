import React from 'react';
import { Card, CardContent, Chip, Typography, Box, useTheme } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  color = 'primary',
  icon,
  trend,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].main}08 100%)`,
        border: `1px solid ${theme.palette[color].main}30`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
          }}
        >
          {icon && (
            <Box sx={{ p: 1, borderRadius: 2, color: theme.palette[color].main }}>{icon}</Box>
          )}
          <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
            {value}
          </Typography>
          {trend && (
            <Chip
              label={`${trend.positive ? '+' : ''}${trend.value}%`}
              size="small"
              color={trend.positive ? 'success' : 'error'}
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;


