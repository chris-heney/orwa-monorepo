import React from 'react';
import { Card, Box, Typography, Grid } from '@mui/material';
import { TrendingUp, TrendingDown, AttachMoney, Receipt } from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

const FinancialMetricsCard = () => {
  const { data: transactions, isLoading } = useGetList('transactions', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'date', order: 'DESC' },
  });

  const { data: invoices } = useGetList('invoices', {
    pagination: { page: 1, perPage: 1000 },
  });

  // Calculate financial metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = transactions?.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const yearlyRevenue = transactions?.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === currentYear;
  }).reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const pendingInvoices = invoices?.filter(i => i.status === 'pending').length || 0;
  const totalOutstanding = invoices?.filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + (i.amount || 0), 0) || 0;

  // Prepare chart data - last 6 months
  const last6Months = [];
  const revenueData = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    last6Months.push(month);
    
    const monthRevenue = transactions?.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() && 
             tDate.getFullYear() === date.getFullYear();
    }).reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    
    revenueData.push(monthRevenue);
  }

  const chartData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenueData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Revenue: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  const MetricBox = ({ icon, label, value, trend, color }) => (
    <Box sx={{ 
      p: 2, 
      borderRadius: 2, 
      backgroundColor: 'background.default',
      border: '1px solid',
      borderColor: 'divider',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ 
          p: 1, 
          borderRadius: 1, 
          backgroundColor: `${color}.main`,
          color: 'white',
          display: 'flex',
        }}>
          {icon}
        </Box>
        {trend && (
          trend > 0 ? 
            <TrendingUp sx={{ color: 'success.main' }} /> : 
            <TrendingDown sx={{ color: 'error.main' }} />
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
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
          <AttachMoney /> Financial Overview
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MetricBox
              icon={<AttachMoney />}
              label="Monthly Revenue"
              value={`$${monthlyRevenue.toLocaleString()}`}
              trend={1}
              color="primary"
            />
          </Grid>
          <Grid item xs={6}>
            <MetricBox
              icon={<AttachMoney />}
              label="Yearly Revenue"
              value={`$${yearlyRevenue.toLocaleString()}`}
              trend={1}
              color="success"
            />
          </Grid>
          <Grid item xs={6}>
            <MetricBox
              icon={<Receipt />}
              label="Pending Invoices"
              value={pendingInvoices}
              color="warning"
            />
          </Grid>
          <Grid item xs={6}>
            <MetricBox
              icon={<AttachMoney />}
              label="Outstanding"
              value={`$${totalOutstanding.toLocaleString()}`}
              color="error"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, minHeight: 300 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Revenue Trend (Last 6 Months)
          </Typography>
          <Box sx={{ height: 250 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default FinancialMetricsCard;
