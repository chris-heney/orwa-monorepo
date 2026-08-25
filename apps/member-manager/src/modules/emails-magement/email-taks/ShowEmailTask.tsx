import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  BooleanField,
  ReferenceField,
  FunctionField,
  useShowController,
  Title,
  RaRecord,
  ShowBase,
} from "react-admin";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
  Alert,
  Paper,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Schedule, Email, Group, CheckCircle, Cancel, People } from "@mui/icons-material";
import CustomShowHeader from "../../memberships_v2/componenets/CustomShowHeader";
import EmailLogsList from "../email-logs/EmailLogList";
import DynamicRecipientList from "./components/DynamicRecipientList";

const cronOptions = [
  { label: "Every Minute", value: "* * * * *" },
  { label: "Every 5 Minutes", value: "*/5 * * * *" },
  { label: "Every 15 Minutes", value: "*/15 * * * *" },
  { label: "Every 30 Minutes", value: "*/30 * * * *" },
  { label: "Every Hour", value: "0 * * * *" },
  { label: "Every Day at 8 AM", value: "0 8 * * *" },
  { label: "Every Friday at 6 PM", value: "0 18 * * 5" },
  { label: "Every Monday at 8 AM", value: "0 8 * * 1" },
  { label: "First Day of Month at 8 AM", value: "0 8 1 * *" },
  { label: "Last Day of Month at 6 PM", value: "0 18 L * *" },
];

const ShowEmailTask = () => {
  const { record, isLoading } = useShowController();

  if (isLoading) return <div>Loading...</div>;
  if (!record) return <div>No record found</div>;

  const getCronDescription = (cronRule: string) => {
    const option = cronOptions.find((opt: { label: string; value: string }) => opt.value === cronRule);
    return option ? option.label : "Custom schedule";
  };

  const formatLastSent = (lastSent: string) => {
    if (!lastSent) return "Never";
    const date = new Date(lastSent);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getStatusColor = (active: boolean) => {
    return active ? "success" : "error";
  };

  const getStatusIcon = (active: boolean) => {
    return active ? <CheckCircle /> : <Cancel />;
  };

  const getTargetAudienceDescription = (entity: string) => {
    const entityMap: { [key: string]: string } = {
      'watersystems': 'Water System Members',
      'associates': 'Associate Members',
      'contacts': 'Contact Database',
      'memberships': 'Membership Records',
      'conference-attendees': 'Conference Attendees',
      'grant-applications': 'Grant Applicants',
      'training-registrations': 'Training Participants'
    };
    return entityMap[entity] || entity?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  return (
    <ShowBase resource="scheduled-email-tasks">
      <>
        <Title title="Email Campaign Details" />
        <Card sx={{ p: 0, m: 0, borderRadius: 0, boxShadow: 'none' }}>
          <CustomShowHeader 
            displayField="name"
            redirectTo="/email-management"
          />
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Campaign Overview */}
              <Grid item xs={12}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Schedule color="primary" />
                    <Typography variant="h6">Campaign Overview</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Campaign Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {record.name}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          icon={getStatusIcon(record.active)}
                          label={record.active ? "Active" : "Inactive"}
                          color={getStatusColor(record.active)}
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Send Schedule
                        </Typography>
                        <Typography variant="body1">
                          {getCronDescription(record.cron_rule)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Sent
                        </Typography>
                        <Typography variant="body1">
                          {formatLastSent(record.last_sent)}
                        </Typography>
                        {record.last_sent && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(record.last_sent).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Email Template Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Email color="primary" />
                    <Typography variant="h6">Email Template</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box>
                    <ReferenceField
                      source="email_template"
                      reference="email-templates"
                      link="edit"
                    >
                      <TextField source="email_name" />
                    </ReferenceField>
                    
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Click to view template details
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Target Audience */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Group color="primary" />
                    <Typography variant="h6">Target Audience</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Audience Type
                    </Typography>
                    <Typography variant="body1">
                      {getTargetAudienceDescription(record.entity)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Recipients List */}
              <Grid item xs={12}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <People color="primary" />
                    <Typography variant="h6">Recipients</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <DynamicRecipientList 
                      maxHeight={400}
                      entity={record.entity + "s"}
                      condition={record.condition}
                      emailTemplate={record.email_template}
                      taskId={record.id}
                      taskName={record.name}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Email History */}
              <Grid item xs={12}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Email History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <EmailLogsList template={record.email_template} />
                  
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </>
    </ShowBase>
  );
};

export default ShowEmailTask;