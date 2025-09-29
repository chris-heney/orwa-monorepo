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

const ScholarshipSummary = () => {
  const { data: applications, isLoading } = useGetList('scholarship-applications', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'submission_date', order: 'DESC' },
  });

  if (isLoading) return <LinearProgress />;

  // Calculate statistics
  const statusCounts = {
    Draft: applications?.filter(a => a.application_status === 'Draft').length || 0,
    Submitted: applications?.filter(a => a.application_status === 'Submitted').length || 0,
    'Under Review': applications?.filter(a => a.application_status === 'Under Review').length || 0,
    Approved: applications?.filter(a => a.application_status === 'Approved').length || 0,
    Denied: applications?.filter(a => a.application_status === 'Denied').length || 0,
  };

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = {
    Draft: '#9e9e9e',
    Submitted: '#2196f3',
    'Under Review': '#ff9800',
    Approved: '#4caf50',
    Denied: '#f44336',
  };

  // Education type distribution
  const educationData = [
    {
      name: 'Four Year College',
      count: applications?.filter(a => a.education_type === 'FourYearCollege').length || 0,
    },
    {
      name: 'Two Year College',
      count: applications?.filter(a => a.education_type === 'TwoYearCollege').length || 0,
    },
    {
      name: 'Vocational School',
      count: applications?.filter(a => a.education_type === 'VocationalSchool').length || 0,
    },
  ];

  // GPA distribution
  const gpaRanges = [
    { range: '0-2.0', min: 0, max: 2.0 },
    { range: '2.0-2.5', min: 2.0, max: 2.5 },
    { range: '2.5-3.0', min: 2.5, max: 3.0 },
    { range: '3.0-3.5', min: 3.0, max: 3.5 },
    { range: '3.5-4.0', min: 3.5, max: 4.0 },
  ];

  const gpaData = gpaRanges.map(range => ({
    name: range.range,
    count: applications?.filter(a => a.gpa >= range.min && a.gpa < range.max).length || 0,
  }));

  // Recent applications
  const recentApplications = applications?.slice(0, 5) || [];

  // Calculate average scores
  const avgGPA = applications?.reduce((sum, a) => sum + (a.gpa || 0), 0) / (applications?.length || 1);
  const avgSAT = applications?.reduce((sum, a) => sum + (a.sat_score || 0), 0) / (applications?.length || 1);
  const avgACT = applications?.reduce((sum, a) => sum + (a.act_score || 0), 0) / (applications?.length || 1);

  return (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Average GPA
              </Typography>
              <Typography variant="h3" color="primary">
                {avgGPA.toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Average SAT Score
              </Typography>
              <Typography variant="h3" color="primary">
                {Math.round(avgSAT)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Average ACT Score
              </Typography>
              <Typography variant="h3" color="primary">
                {Math.round(avgACT)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" color="textSecondary">
                Approval Rate
              </Typography>
              <Typography variant="h3" color="success.main">
                {applications?.length ? 
                  `${((statusCounts.Approved / applications.length) * 100).toFixed(1)}%` 
                  : '0%'
                }
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Status Distribution Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Application Status Distribution
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

      {/* Education Type Distribution */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Education Type Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* GPA Distribution */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            GPA Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gpaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Recent Applications */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Applications
          </Typography>
          <List>
            {recentApplications.map((app: any) => (
              <ListItem key={app.id} divider>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {app.applicant_first_name?.[0]}{app.applicant_last_name?.[0]}
                </Avatar>
                <ListItemText
                  primary={`${app.applicant_first_name} ${app.applicant_last_name}`}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {app.school_name} • GPA: {app.gpa?.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Submitted: {app.submission_date ? formatDate(app.submission_date) : 'Not submitted'}
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  label={app.application_status}
                  size="small"
                  sx={{
                    backgroundColor: COLORS[app.application_status as keyof typeof COLORS],
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

export default ScholarshipSummary;
