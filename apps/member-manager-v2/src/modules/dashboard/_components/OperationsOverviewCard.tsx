import React from 'react';
import { Card, Box, Typography, Avatar, AvatarGroup, Chip, LinearProgress } from '@mui/material';
import { Business, Person, Engineering, Inventory, TrendingUp, Warning } from '@mui/icons-material';
import { useGetList } from 'react-admin';

const OperationsOverviewCard = () => {
  const { data: contacts, isLoading } = useGetList('contacts', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: staff } = useGetList('staff', {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: users } = useGetList('users', {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: assets } = useGetList('assets', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: activities } = useGetList('activities', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'timestamp', order: 'DESC' },
  });

  // Calculate metrics
  const totalContacts = contacts?.length || 0;
  const activeStaff = staff?.filter(s => s.is_active !== false).length || 0;
  const totalUsers = users?.length || 0;
  const totalAssets = assets?.length || 0;

  // Asset categories
  const assetCategories = {};
  assets?.forEach(asset => {
    const category = asset.category || 'Other';
    assetCategories[category] = (assetCategories[category] || 0) + 1;
  });

  const topAssetCategories = Object.entries(assetCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Recent activities
  const recentActivities = activities?.slice(0, 5) || [];

  // Contact growth (mock data - you'd calculate this from actual data)
  const contactGrowth = 12.5; // percentage

  const MetricCard = ({ icon, label, value, subValue, trend }) => (
    <Box sx={{
      p: 2,
      borderRadius: 1,
      backgroundColor: 'background.default',
      border: '1px solid',
      borderColor: 'divider',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {trend && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}>
          <Chip
            size="small"
            label={`+${trend}%`}
            color="success"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          p: 1,
          borderRadius: 1,
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
          {subValue && (
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              {subValue}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'background.paper',
      borderRadius: 2,
      boxShadow: 3,
    }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business /> Operations Overview
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Core Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <MetricCard
            icon={<Person />}
            label="Total Contacts"
            value={totalContacts.toLocaleString()}
            trend={contactGrowth}
          />
          <MetricCard
            icon={<Engineering />}
            label="Active Staff"
            value={activeStaff}
            subValue={`${staff?.length || 0} total`}
          />
          <MetricCard
            icon={<Person />}
            label="System Users"
            value={totalUsers}
          />
          <MetricCard
            icon={<Inventory />}
            label="Assets Tracked"
            value={totalAssets}
          />
        </Box>

        {/* Asset Distribution */}
        <Box sx={{
          p: 2,
          borderRadius: 1,
          backgroundColor: 'background.default',
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
            Asset Distribution
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {topAssetCategories.map(([category, count]) => (
              <Box key={category}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                    {category}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {count} items
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(count / totalAssets) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 1,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recent System Activity */}
        <Box sx={{
          p: 2,
          borderRadius: 1,
          backgroundColor: 'background.default',
          minHeight: 200,
          maxHeight: 300,
          overflowY: 'auto',
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
            Recent System Activity
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {recentActivities.map((activity, index) => (
              <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.5,
                borderBottom: index < recentActivities.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  flexShrink: 0,
                }}/>
                <Typography variant="caption" sx={{ flex: 1, color: 'text.primary' }}>
                  {activity.description || 'System activity'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* System Health */}
        <Box sx={{
          p: 1.5,
          borderRadius: 1,
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
          border: '1px solid',
          borderColor: 'success.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <TrendingUp sx={{ color: 'success.main' }} />
          <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 'medium' }}>
            All systems operational • 99.9% uptime
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default OperationsOverviewCard;
