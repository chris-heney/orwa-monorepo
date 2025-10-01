import React from 'react';
import { Card, Box, Typography, Chip, Avatar, AvatarGroup } from '@mui/material';
import { Event, People, Store, EmojiEvents, TrendingUp } from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ConferenceMetricsCard = () => {
  const { data: conferences, isLoading } = useGetList('conferences', {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: attendees } = useGetList('conference-attendees', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: sponsors } = useGetList('conference-sponsors', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: booths } = useGetList('conference-booths', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: contestants } = useGetList('conference-contestants', {
    pagination: { page: 1, perPage: 1000 },
  });

  const { data: registrations } = useGetList('conference-registrations', {
    pagination: { page: 1, perPage: 1000 },
  });

  // Get next conference
  const upcomingConferences = conferences?.filter(c => new Date(c.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)) || [];
  const nextConference = upcomingConferences[0];

  // Calculate metrics for next conference
  const nextConfAttendees = attendees?.filter(a => a.conference_id === nextConference?.id).length || 0;
  const nextConfSponsors = sponsors?.filter(s => s.conference_id === nextConference?.id).length || 0;
  const nextConfBooths = booths?.filter(b => b.conference_id === nextConference?.id).length || 0;
  const nextConfContestants = contestants?.filter(c => c.conference_id === nextConference?.id).length || 0;

  // Overall metrics
  const totalConferences = conferences?.length || 0;
  const totalAttendees = attendees?.length || 0;
  const totalSponsors = sponsors?.length || 0;
  const totalBooths = booths?.length || 0;

  // Conference comparison radar chart
  const recentConferences = conferences?.slice(-3) || [];
  const radarData = {
    labels: ['Attendees', 'Sponsors', 'Booths', 'Contestants', 'Registrations'],
    datasets: recentConferences.map((conf, index) => ({
      label: conf.name,
      data: [
        attendees?.filter(a => a.conference_id === conf.id).length || 0,
        sponsors?.filter(s => s.conference_id === conf.id).length || 0,
        booths?.filter(b => b.conference_id === conf.id).length || 0,
        contestants?.filter(c => c.conference_id === conf.id).length || 0,
        registrations?.filter(r => r.conference_id === conf.id).length || 0,
      ],
      backgroundColor: `rgba(${54 + index * 50}, ${162 - index * 30}, ${235 - index * 40}, 0.2)`,
      borderColor: `rgba(${54 + index * 50}, ${162 - index * 30}, ${235 - index * 40}, 1)`,
      borderWidth: 2,
    })),
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 10,
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
      },
    },
  };

  const MetricCard = ({ icon, value, label, color = 'primary' }) => (
    <Box sx={{
      p: 1.5,
      borderRadius: 1,
      backgroundColor: 'background.default',
      border: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
    }}>
      <Box sx={{ color: `${color}.main` }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
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
          <Event /> Conference Analytics
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Next Conference Info */}
        {nextConference && (
          <Box sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
            border: '1px solid',
            borderColor: 'primary.main',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {nextConference.name}
              </Typography>
              <Chip 
                label={`${Math.ceil((new Date(nextConference.start_date) - new Date()) / (1000 * 60 * 60 * 24))} days`}
                color="primary"
                size="small"
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {new Date(nextConference.start_date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{nextConfAttendees}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Attendees</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{nextConfSponsors}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sponsors</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{nextConfBooths}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Booths</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{nextConfContestants}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Contestants</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Overall Metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          <MetricCard 
            icon={<Event />} 
            value={totalConferences} 
            label="Total Conferences" 
            color="primary"
          />
          <MetricCard 
            icon={<People />} 
            value={totalAttendees} 
            label="Total Attendees" 
            color="success"
          />
          <MetricCard 
            icon={<Store />} 
            value={totalBooths} 
            label="Total Booths" 
            color="info"
          />
          <MetricCard 
            icon={<EmojiEvents />} 
            value={totalSponsors} 
            label="Total Sponsors" 
            color="warning"
          />
        </Box>

        {/* Conference Comparison Radar */}
        <Box sx={{ mt: 2, minHeight: 300 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Conference Comparison
          </Typography>
          <Box sx={{ height: 250 }}>
            <Radar data={radarData} options={radarOptions} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ConferenceMetricsCard;
