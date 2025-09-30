import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGetList } from 'react-admin';
import { formatDate } from '../../../../helpers/dateFormatter';

const AwardNominationSummary = () => {
  const { data: nominations, isLoading } = useGetList('award-nominations', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'submission_date', order: 'DESC' },
  });

  if (isLoading) return <LinearProgress />;

  // Calculate statistics
  const statusCounts = {
    Draft: nominations?.filter(n => n.nomination_status === 'Draft').length || 0,
    Submitted: nominations?.filter(n => n.nomination_status === 'Submitted').length || 0,
    'Under Review': nominations?.filter(n => n.nomination_status === 'Under Review').length || 0,
    Winner: nominations?.filter(n => n.nomination_status === 'Winner').length || 0,
    'Runner Up': nominations?.filter(n => n.nomination_status === 'Runner Up').length || 0,
    'Not Selected': nominations?.filter(n => n.nomination_status === 'Not Selected').length || 0,
  };

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = {
    Draft: '#9e9e9e',
    Submitted: '#2196f3',
    'Under Review': '#ff9800',
    Winner: '#4caf50',
    'Runner Up': '#8bc34a',
    'Not Selected': '#f44336',
  };

  // Award type distribution
  const awardTypeData = [
    {
      name: 'Water/Wastewater System of the Year',
      count: nominations?.filter(n => n.award_type === 'Water/Wastewater System of the Year').length || 0,
    },
    {
      name: 'Excellence in Operations',
      count: nominations?.filter(n => n.award_type === 'Excellence in Operations').length || 0,
    },
    {
      name: 'Excellence in Management',
      count: nominations?.filter(n => n.award_type === 'Excellence in Management').length || 0,
    },
    {
      name: 'Excellence in Office Operations',
      count: nominations?.filter(n => n.award_type === 'Excellence in Office Operations').length || 0,
    },
  ];

  // Year distribution
  const yearData = nominations?.reduce((acc, nom) => {
    const year = nom.award_year || new Date().getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) || {};

  const yearChartData = Object.entries(yearData)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year);

  // Recent nominations
  const recentNominations = nominations?.slice(0, 5) || [];

  // Calculate success rate
  const totalProcessed = (statusCounts.Winner + statusCounts['Runner Up'] + statusCounts['Not Selected']);
  const successRate = totalProcessed > 0 ? 
    ((statusCounts.Winner + statusCounts['Runner Up']) / totalProcessed) * 100 : 0;

  return (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Success Rate
              </Typography>
              <Typography variant="h3" color="primary">
                {successRate.toFixed(1)}%
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Total Winners
              </Typography>
              <Typography variant="h3" color="success.main">
                {statusCounts.Winner}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Runner Ups
              </Typography>
              <Typography variant="h3" color="warning.main">
                {statusCounts['Runner Up']}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Pending Review
              </Typography>
              <Typography variant="h3" color="info.main">
                {statusCounts['Under Review'] + statusCounts.Submitted}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Status Distribution Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Nomination Status Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Award Type Distribution */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Award Type Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={awardTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Year Distribution */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Nominations by Year
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Recent Nominations */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Nominations
          </Typography>
          <List>
            {recentNominations.map((nom: any) => (
              <ListItem key={nom.id} divider>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {nom.nominee_name?.[0] || 'N'}
                </Avatar>
                <ListItemText
                  primary={nom.nominee_name}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {nom.award_type} • {nom.county}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Submitted: {nom.submission_date ? formatDate(nom.submission_date) : 'Not submitted'}
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  label={nom.nomination_status}
                  size="small"
                  sx={{
                    backgroundColor: COLORS[nom.nomination_status as keyof typeof COLORS],
                    color: 'white',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AwardNominationSummary;
