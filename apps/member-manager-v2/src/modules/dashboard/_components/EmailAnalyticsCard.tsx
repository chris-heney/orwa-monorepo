import React from 'react';
import { Card, Box, Typography, CircularProgress, Chip } from '@mui/material';
import { Email, Send, Schedule, CheckCircle, Error } from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmailAnalyticsCard = () => {
  const { data: emailLogs, isLoading } = useGetList('email-logs', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'createdAt', order: 'DESC' },
  });

  const { data: emailTasks } = useGetList('email-tasks', {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: emailTemplates } = useGetList('email-templates', {
    pagination: { page: 1, perPage: 100 },
  });

  // Calculate email metrics
  const totalSent = emailLogs?.filter(e => e.status === 'sent').length || 0;
  const totalFailed = emailLogs?.filter(e => e.status === 'failed').length || 0;
  const totalScheduled = emailTasks?.filter(t => t.is_active).length || 0;
  const totalTemplates = emailTemplates?.length || 0;

  const deliveryRate = totalSent + totalFailed > 0 
    ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(1) 
    : 0;

  // Email activity over last 7 days
  const last7Days = [];
  const emailCounts = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    last7Days.push(dayName);
    
    const dayEmails = emailLogs?.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate.toDateString() === date.toDateString();
    }).length || 0;
    
    emailCounts.push(dayEmails);
  }

  const lineData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Emails Sent',
        data: emailCounts,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Email by module
  const moduleCount = {};
  emailLogs?.forEach(log => {
    const module = log.module || 'Other';
    moduleCount[module] = (moduleCount[module] || 0) + 1;
  });

  const topModules = Object.entries(moduleCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const barData = {
    labels: topModules.map(([name]) => name),
    datasets: [{
      label: 'Emails by Module',
      data: topModules.map(([, count]) => count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
          <Email /> Email Analytics
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Key Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Box sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={parseFloat(deliveryRate)}
                size={50}
                thickness={4}
                sx={{
                  color: parseFloat(deliveryRate) > 90 ? 'success.main' : 
                         parseFloat(deliveryRate) > 70 ? 'warning.main' : 'error.main',
                }}
              />
              <Box sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {deliveryRate}%
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalSent}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Emails Delivered
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Schedule sx={{ color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalScheduled}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Active Scheduled Tasks
            </Typography>
          </Box>

          <Box sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Email sx={{ color: 'info.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalTemplates}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Email Templates
            </Typography>
          </Box>

          <Box sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: totalFailed > 0 ? 'error.light' : 'background.default',
            border: '1px solid',
            borderColor: totalFailed > 0 ? 'error.main' : 'divider',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Error sx={{ color: totalFailed > 0 ? 'error.dark' : 'text.secondary' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalFailed}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: totalFailed > 0 ? 'error.dark' : 'text.secondary' }}>
              Failed Deliveries
            </Typography>
          </Box>
        </Box>

        {/* Charts */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
          {/* 7-Day Activity */}
          <Box sx={{ minHeight: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              7-Day Email Activity
            </Typography>
            <Box sx={{ height: 150 }}>
              <Line data={lineData} options={chartOptions} />
            </Box>
          </Box>

          {/* Top Modules */}
          <Box sx={{ minHeight: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Emails by Module
            </Typography>
            <Box sx={{ height: 150 }}>
              <Bar data={barData} options={chartOptions} />
            </Box>
          </Box>
        </Box>

        {/* Recent Activity */}
        <Box sx={{
          p: 1.5,
          borderRadius: 1,
          backgroundColor: 'background.default',
          maxHeight: 100,
          overflowY: 'auto',
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Recent Email Activity
          </Typography>
          {emailLogs?.slice(0, 3).map((log, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 0.5,
              borderBottom: index < 2 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}>
              <Typography variant="caption" sx={{ flex: 1 }}>
                {log.subject || 'No subject'}
              </Typography>
              <Chip
                size="small"
                label={log.status}
                color={log.status === 'sent' ? 'success' : log.status === 'failed' ? 'error' : 'default'}
                sx={{ ml: 1 }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default EmailAnalyticsCard;
