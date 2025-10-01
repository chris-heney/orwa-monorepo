import React from 'react';
import { Card, Box, Typography, LinearProgress, Chip } from '@mui/material';
import { RequestPage, CheckCircle, HourglassEmpty, Cancel, AttachMoney } from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GrantAnalyticsCard = () => {
  const { data: applications, isLoading } = useGetList('grant-application-finals', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: payouts } = useGetList('grant-payouts', {
    pagination: { page: 1, perPage: 1000 },
  });

  // Calculate grant metrics
  const totalApplications = applications?.length || 0;
  const approvedGrants = applications?.filter(a => a.status === 'approved').length || 0;
  const pendingGrants = applications?.filter(a => a.status === 'pending' || a.status === 'under_review').length || 0;
  const rejectedGrants = applications?.filter(a => a.status === 'rejected').length || 0;

  const totalRequested = applications?.reduce((sum, a) => sum + (a.amount_requested || 0), 0) || 0;
  const totalApproved = applications?.filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + (a.amount_approved || a.amount_requested || 0), 0) || 0;
  const totalPaidOut = payouts?.filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  const approvalRate = totalApplications > 0 ? ((approvedGrants / totalApplications) * 100).toFixed(1) : 0;

  // Status distribution for pie chart
  const pieData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [approvedGrants, pendingGrants, rejectedGrants],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(244, 67, 54, 0.8)',
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(244, 67, 54, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Grant categories
  const categories = {};
  applications?.forEach(app => {
    const category = app.category || 'Other';
    categories[category] = (categories[category] || 0) + 1;
  });

  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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
          <RequestPage /> Grant Management
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Financial Summary */}
        <Box sx={{
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
          border: '1px solid',
          borderColor: 'success.main',
        }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Requested
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                ${totalRequested.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Approved
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                ${totalApproved.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Paid Out
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                ${totalPaidOut.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Status Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 1,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RequestPage sx={{ color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {totalApplications}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Total Applications
            </Typography>
          </Box>

          <Box sx={{
            p: 1.5,
            borderRadius: 1,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: 'success.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {approvalRate}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Approval Rate
            </Typography>
          </Box>
        </Box>

        {/* Charts and Categories */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
          {/* Status Distribution */}
          <Box sx={{ minHeight: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Application Status
            </Typography>
            <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={pieData} options={pieOptions} />
            </Box>
          </Box>

          {/* Top Categories */}
          <Box sx={{ minHeight: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Top Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {topCategories.map(([category, count], index) => (
                <Box key={category} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{
                    width: '100%',
                    position: 'relative',
                  }}>
                    <LinearProgress
                      variant="determinate"
                      value={(count / totalApplications) * 100}
                      sx={{
                        height: 28,
                        borderRadius: 1,
                        backgroundColor: 'background.default',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: ['primary.main', 'success.main', 'warning.main'][index],
                        },
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 8,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {category} ({count})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Pending Actions */}
        {pendingGrants > 0 && (
          <Box sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: 'warning.light',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <HourglassEmpty sx={{ color: 'warning.dark' }} />
            <Typography variant="caption" sx={{ color: 'warning.dark', fontWeight: 'bold' }}>
              {pendingGrants} applications pending review
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default GrantAnalyticsCard;
