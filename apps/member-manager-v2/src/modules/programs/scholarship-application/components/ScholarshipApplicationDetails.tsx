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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ResponsiveListItem from "../../../_components/ResponsiveListItem";
import { IScholarshipApplication } from "../ScholarshipApplicationTypes";
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
    case 'Approved':
      return theme.palette.success.main;
    case 'Denied':
      return theme.palette.error.main;
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

const ScholarshipApplicationDetails = () => {
  const record = useRecordContext<IScholarshipApplication>();
  const theme = useTheme();

  if (!record) return null;

  const totalFinancialAid = (record.financial1_amount || 0) + (record.financial2_amount || 0);

  return (
    <Box sx={{ p: 2 }}>
      {/* Status Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Chip
          label={record.application_status}
          sx={{
            backgroundColor: getStatusColor(record.application_status, theme) || '#9e9e9e',
            color: getContrastColor(getStatusColor(record.application_status, theme) || '#9e9e9e'),
            fontWeight: 'bold',
            fontSize: '1rem',
            padding: '20px 10px',
          }}
        />
        
        {record.applicant_pdf && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={() => {
              window.open(
                record.applicant_pdf?.url,
                "_blank"
              );
            }}
          >
            View Complete Application PDF
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Applicant Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Applicant Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem
            label="Full Name"
            value={`${record.applicant_first_name} ${record.applicant_middle_name || ''} ${record.applicant_last_name}`.trim()}
            divider
          />
          <ResponsiveListItem label="Email" value={record.applicant_email} divider />
          <ResponsiveListItem label="Phone" value={record.applicant_phone} divider />
          <ResponsiveListItem
            label="Address"
            value={`${record.applicant_street}, ${record.applicant_city}, ${record.applicant_state} ${record.applicant_zip}`}
            divider
          />
          <ResponsiveListItem label="Age Confirmation" value={record.age_confirm} divider />
        </Grid>

        {/* Water System Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Water System Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem
            label="System Name"
            value={record.watersystem?.name || record.system_name}
            divider
          />
          <ResponsiveListItem label="Relationship" value={record.relationship} divider />
          {record.contact && (
            <ResponsiveListItem
              label="Contact"
              value={`${record.contact.first} ${record.contact.last}`}
              divider
            />
          )}
        </Grid>

        {/* Eligible Participant Information */}
        {record.eligible_participant_name && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Eligible Participant
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveListItem
              label="Name"
              value={`${record.eligible_participant_name.first} ${record.eligible_participant_name.middle || ''} ${record.eligible_participant_name.last}`.trim()}
              divider
            />
            <ResponsiveListItem label="Title" value={record.eligible_participant_title} divider />
            <ResponsiveListItem label="Phone" value={record.eligible_participant_phone} divider />
            <ResponsiveListItem label="Email" value={record.eligible_participant_email} divider />
            {record.eligible_participant_address && (
              <ResponsiveListItem
                label="Address"
                value={`${record.eligible_participant_address.street}, ${record.eligible_participant_address.city}, ${record.eligible_participant_address.state} ${record.eligible_participant_address.zip}`}
                divider
              />
            )}
          </Grid>
        )}

        {/* School Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            School Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem label="School Name" value={record.school_name} divider />
          <ResponsiveListItem 
            label="Graduation Date" 
            value={formatDate(record.graduation_date)} 
            divider 
          />
          {record.school_address && (
            <ResponsiveListItem
              label="School Address"
              value={`${record.school_address.street}, ${record.school_address.city}, ${record.school_address.state} ${record.school_address.zip}`}
              divider
            />
          )}
          <ResponsiveListItem label="Education Type" value={record.education_type} divider />
          <ResponsiveListItem label="Major" value={record.major || 'N/A'} divider />
          <ResponsiveListItem label="First Year" value={record.first_year} divider />
        </Grid>

        {/* Academic Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Academic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ResponsiveListItem 
            label="High School GPA" 
            value={record.gpa?.toFixed(2) || 'N/A'} 
            divider 
          />
          <ResponsiveListItem label="SAT Score" value={record.sat_score} divider />
          <ResponsiveListItem label="ACT Score" value={record.act_score} divider />
          <ResponsiveListItem 
            label="College GPA" 
            value={record.college_gpa?.toFixed(2) || 'N/A'} 
            divider 
          />
          <ResponsiveListItem 
            label="Credits Completed" 
            value={`${record.credits_completed} / ${record.credits_required}`} 
            divider 
          />
          {record.awards && (
            <ResponsiveListItem label="Awards & Honors" value={record.awards} divider />
          )}
        </Grid>

        {/* Financial Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Financial Aid Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {record.financial1_institution && (
            <ResponsiveListItem
              label={record.financial1_institution}
              value={formatNumber(record.financial1_amount || 0)}
              divider
            />
          )}
          {record.financial2_institution && (
            <ResponsiveListItem
              label={record.financial2_institution}
              value={formatNumber(record.financial2_amount || 0)}
              divider
            />
          )}
          <ResponsiveListItem
            label="Total Financial Aid"
            value={formatNumber(totalFinancialAid)}
            divider
          />
        </Grid>

        {/* Recommenders */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Recommenders
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Recommender 1
                </Typography>
                {record.recommender1_name && (
                  <ResponsiveListItem
                    label="Name"
                    value={`${record.recommender1_name.first} ${record.recommender1_name.middle || ''} ${record.recommender1_name.last}`.trim()}
                    divider
                  />
                )}
                <ResponsiveListItem label="Email" value={record.recommender1_email} divider />
                <ResponsiveListItem label="Phone" value={record.recommender1_phone} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Recommender 2
                </Typography>
                {record.recommender2_name && (
                  <ResponsiveListItem
                    label="Name"
                    value={`${record.recommender2_name.first} ${record.recommender2_name.middle || ''} ${record.recommender2_name.last}`.trim()}
                    divider
                  />
                )}
                <ResponsiveListItem label="Email" value={record.recommender2_email} divider />
                <ResponsiveListItem label="Phone" value={record.recommender2_phone} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Application Documents
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {record.transcript && <FileDisplay file={record.transcript} label="Official Transcript" />}
              {record.test_scores && <FileDisplay file={record.test_scores} label="Test Scores (SAT/ACT)" />}
              {record.essay && <FileDisplay file={record.essay} label="Essay" />}
              {record.biography && <FileDisplay file={record.biography} label="Biography" />}
            </Grid>
            <Grid item xs={12} md={6}>
              {record.recommendation_letter_1 && 
                <FileDisplay file={record.recommendation_letter_1} label="Recommendation Letter 1" />
              }
              {record.recommendation_letter_2 && 
                <FileDisplay file={record.recommendation_letter_2} label="Recommendation Letter 2" />
              }
              {record.photograph && <FileDisplay file={record.photograph} label="Photograph" />}
              {record.applicant_pdf && <FileDisplay file={record.applicant_pdf} label="Complete Application PDF" />}
            </Grid>
          </Grid>
        </Grid>

        {/* Certifications */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Certifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Applicant Certification
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {record.applicant_certification ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <CancelIcon color="error" />
                  )}
                  <Typography>
                    {record.applicant_certification ? 'Certified' : 'Not Certified'}
                  </Typography>
                </Box>
                {record.applicant_certification_date && (
                  <Typography variant="caption" color="textSecondary">
                    Date: {formatDate(record.applicant_certification_date)}
                  </Typography>
                )}
              </Paper>
            </Grid>
            {record.guardian_name && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Guardian Certification
                  </Typography>
                  <ResponsiveListItem
                    label="Guardian Name"
                    value={`${record.guardian_name.first} ${record.guardian_name.middle || ''} ${record.guardian_name.last}`.trim()}
                    divider
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {record.guardian_certification ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <Typography>
                      {record.guardian_certification ? 'Certified' : 'Not Certified'}
                    </Typography>
                  </Box>
                  {record.guardian_certification_date && (
                    <Typography variant="caption" color="textSecondary">
                      Date: {formatDate(record.guardian_certification_date)}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Review Notes */}
        {record.review_notes && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Review Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
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
                label="Application ID"
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

export default ScholarshipApplicationDetails;
