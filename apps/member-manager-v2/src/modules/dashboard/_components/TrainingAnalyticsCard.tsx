import React from 'react';
import { Card, Box, Typography, LinearProgress, Chip } from '@mui/material';
import { School, EventAvailable, Group, CheckCircle } from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrainingAnalyticsCard = () => {
  const { data: events, isLoading } = useGetList('training-events', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: registrations } = useGetList('training-event-registrations', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: certifications } = useGetList('training-instructor-certifications', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: topics } = useGetList('training-topics', {
    pagination: { page: 1, perPage: 100 },
  });

  // Calculate metrics
  const currentYear = new Date().getFullYear();
  const upcomingEvents = events?.filter(e => new Date(e.start_date) > new Date()).length || 0;
  const completedEvents = events?.filter(e => {
    const date = new Date(e.end_date);
    return date < new Date() && date.getFullYear() === currentYear;
  }).length || 0;
  
  const totalAttendees = registrations?.filter(r => r.status === 'confirmed').length || 0;
  const activeCertifications = certifications?.filter(c => c.is_active).length || 0;

  // Topic distribution for doughnut chart
  const topicCounts = {};
  events?.forEach(event => {
    if (event.topic_name) {
      topicCounts[event.topic_name] = (topicCounts[event.topic_name] || 0) + 1;
    }
  });

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const doughnutData = {
    labels: topTopics.map(([name]) => name),
    datasets: [{
      data: topTopics.map(([, count]) => count),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      borderWidth: 2,
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
    }],
  };

  // Monthly training events for bar chart
  const monthlyEvents = Array(12).fill(0);
  events?.forEach(event => {
    const month = new Date(event.start_date).getMonth();
    const year = new Date(event.start_date).getFullYear();
    if (year === currentYear) {
      monthlyEvents[month]++;
    }
  });

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Training Events',
      data: monthlyEvents,
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
        ticks: {
          stepSize: 1,
        },
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
          <School /> Training Analytics
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
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EventAvailable sx={{ color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {upcomingEvents}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Upcoming Events
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
              <CheckCircle sx={{ color: 'success.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {completedEvents}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Completed This Year
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
              <Group sx={{ color: 'info.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {totalAttendees}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Total Registrations
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
              <School sx={{ color: 'warning.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {activeCertifications}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Active Certifications
            </Typography>
          </Box>
        </Box>

        {/* Charts Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
          {/* Topic Distribution */}
          <Box sx={{ minHeight: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Top Training Topics
            </Typography>
            <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Box>
          
          {/* Monthly Events */}
          <Box sx={{ minHeight: 250 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Monthly Training Events
            </Typography>
            <Box sx={{ height: 200 }}>
              <Bar data={barData} options={chartOptions} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default TrainingAnalyticsCard;
