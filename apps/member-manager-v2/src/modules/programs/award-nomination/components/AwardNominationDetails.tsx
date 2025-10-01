import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import { useRecordContext } from "react-admin";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ResponsiveListItem from "../../../_components/ResponsiveListItem";
import { IAwardNomination } from "../AwardNominationTypes";
import { formatDate } from "../../../../helpers/dateFormatter";
import { formatNumber } from "../../../../helpers/Formators";
import getContrastColor from "../../../_helpers/getContrastColor";


const getStatusColor = (status: string, theme: any) => {
  switch (status) {
    case 'Draft':
      return theme.palette.grey[500];
    case 'Submitted':
      return theme.palette.info.main;
    case 'Under Review':
      return theme.palette.warning.main;
    case 'Winner':
      return theme.palette.success.main;
    case 'Runner Up':
      return theme.palette.success.light;
    case 'Not Selected':
      return theme.palette.error.main;
    default:
      return theme.palette.grey[500];
  }
};

const getAwardTypeColor = (type: string, theme: any) => {
  switch (type) {
    case 'Water/Wastewater System of the Year':
      return theme.palette.primary.main;
    case 'Excellence in Operations':
      return theme.palette.success.main;
    case 'Excellence in Management':
      return theme.palette.secondary.main;
    case 'Excellence in Office Operations':
      return theme.palette.warning.main;
    default:
      return theme.palette.grey[500];
  }
};

const FileDisplay = ({ file, label }: { file: any; label: string }) => {
  if (!file) return null;

  const handleView = () => {
    window.open(file.url, "_blank");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name || `${label}.pdf`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2">{label}</Typography>
        <Box>
          <IconButton size="small" onClick={handleView} color="primary">
            <VisibilityIcon />
          </IconButton>
          <IconButton size="small" onClick={handleDownload} color="primary">
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="caption" color="textSecondary">
        {file.name} ({file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'N/A'})
      </Typography>
    </Paper>
  );
};

const AwardNominationDetails = () => {
  const record = useRecordContext<IAwardNomination>();
  const theme = useTheme();
  if (!record) return null;

  return (
    <Box sx={{ p: 2 }}>
      {/* Status and Award Type Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Chip
            label={record.nomination_status}
            sx={{
              backgroundColor: getStatusColor(record.nomination_status, theme) || '#9e9e9e',
              color: getContrastColor(getStatusColor(record.nomination_status, theme) || '#9e9e9e'),
              fontWeight: 'bold',
              fontSize: '1rem',
              padding: '20px 10px',
            }}
          />
          <Chip
            label={record.award_type}
            sx={{
              backgroundColor: getAwardTypeColor(record.award_type, theme) || '#757575',
              color: getContrastColor(getAwardTypeColor(record.award_type, theme) || '#757575'),
              fontWeight: 'bold',
              fontSize: '0.9rem',
              padding: '18px 8px',
            }}
          />
        </Box>
        
        {record.nomination_pdf && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={() => {
              window.open(
                `${import.meta.env.VITE_API_ENDPOINT}${record.nomination_pdf?.url}`,
                "_blank"
              );
            }}
          >
            View Nomination PDF
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Nominee Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Nominee Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem
            label="Nominee/System Name"
            value={record.nominee_name}
            divider
          />
          <ResponsiveListItem
            label="System Name"
            value={record.system_name}
            divider
          />
          <ResponsiveListItem
            label="Water System"
            value={record.watersystem?.name || 'N/A'}
            divider
          />
          <ResponsiveListItem
            label="Award Year"
            value={record.award_year}
            divider
          />
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem label="Email" value={record.email} divider />
          <ResponsiveListItem label="Phone" value={record.daytime_phone} divider />
          {record.contact && (
            <ResponsiveListItem
              label="Contact Person"
              value={`${record.contact.first} ${record.contact.last}`}
              divider
            />
          )}
        </Grid>

        {/* Location Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Location Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem label="Address" value={record.address} divider />
          <ResponsiveListItem label="City" value={record.city} divider />
          <ResponsiveListItem label="State" value={record.state} divider />
          <ResponsiveListItem label="ZIP Code" value={record.zip} divider />
          <ResponsiveListItem label="County" value={record.county} divider />
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            System Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem 
            label="Operation Start Date" 
            value={record.operation_start_date ? formatDate(record.operation_start_date) : 'N/A'} 
            divider 
          />
          <ResponsiveListItem 
            label="Employment Date" 
            value={record.employment_date ? formatDate(record.employment_date) : 'N/A'} 
            divider 
          />
          <ResponsiveListItem 
            label="Current Members" 
            value={record.current_members || 'N/A'} 
            divider 
          />
          <ResponsiveListItem 
            label="Beginning Members" 
            value={record.beginning_members || 'N/A'} 
            divider 
          />
        </Grid>

        {/* Employee Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Employee Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem 
            label="Clerical Employees" 
            value={record.clerical_employees || 0} 
            divider 
          />
          <ResponsiveListItem 
            label="Operation & Maintenance" 
            value={record.operation_maintenance_employees || 0} 
            divider 
          />
          <ResponsiveListItem 
            label="Management Employees" 
            value={record.management_employees || 0} 
            divider 
          />
          <ResponsiveListItem 
            label="Total Employees" 
            value={
              (record.clerical_employees || 0) + 
              (record.operation_maintenance_employees || 0) + 
              (record.management_employees || 0)
            } 
            divider 
          />
        </Grid>

        {/* Nomination Description */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Nomination Description
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {record.nomination_description}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              {record.nomination_description?.length || 0}/300 characters
            </Typography>
          </Paper>
        </Grid>

        {/* Documents Section */}
        {(record.nomination_pdf || (record.supporting_documents && record.supporting_documents.length > 0)) && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Documents
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {record.nomination_pdf && (
                <Grid item xs={12} md={6}>
                  <FileDisplay file={record.nomination_pdf} label="Nomination PDF" />
                </Grid>
              )}
              {record.supporting_documents?.map((doc, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FileDisplay file={doc} label={`Supporting Document ${index + 1}`} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Review Notes */}
        {record.review_notes && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Review Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper sx={{ p: 2, backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
              <Typography>{record.review_notes}</Typography>
            </Paper>
          </Grid>
        )}

        {/* Metadata */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Application Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ResponsiveListItem
                label="Nomination ID"
                value={`#${record.id}`}
                divider
              />
              <ResponsiveListItem
                label="Submission Date"
                value={record.submission_date ? formatDate(record.submission_date) : 'Not Submitted'}
                divider
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ResponsiveListItem
                label="Created Date"
                value={record.createdAt ? formatDate(record.createdAt) : 'N/A'}
                divider
              />
              <ResponsiveListItem
                label="Last Updated"
                value={record.updatedAt ? formatDate(record.updatedAt) : 'N/A'}
                divider
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AwardNominationDetails;
