import React from "react";
import { Box, Chip, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
  List,
  TextField,
  DatagridConfigurable,
  DateField,
  useRefresh,
  FunctionField,
  FilterLiveSearch,
  EmailField,
  NumberField,
  RaRecord,
  TopToolbar,
  CreateButton,
  ExportButton,
} from "react-admin";
import CustomPagination from "../../_components/CustomPagination";
import { customDatagridStyle } from "../../../css";
import getContrastColor from "../../_helpers/getContrastColor";

const statusColors: Record<string, string> = {
  'Draft': '#9e9e9e',
  'Submitted': '#2196f3',
  'Under Review': '#ff9800',
  'Approved': '#4caf50',
  'Denied': '#f44336',
};

const ScholarshipListActions = () => (
  <TopToolbar>
    <FilterLiveSearch />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

interface ScholarshipApplicationListProps {
  filter?: any;
}

const ScholarshipApplicationList = ({ filter = {} }: ScholarshipApplicationListProps) => {
  const refresh = useRefresh();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <List
        title=" "
        resource="scholarship-applications"
        actions={<ScholarshipListActions />}
        filter={filter}
        queryOptions={{
          meta: {
            raw: true,
            populate: ['contact', 'watersystem', 'transcript', 'test_scores', 
                       'recommendation_letter_1', 'recommendation_letter_2', 
                       'essay', 'biography', 'photograph', 'applicant_pdf'],
          },
        }}
        sort={{ field: "submission_date", order: "DESC" }}
        perPage={50}
        pagination={<CustomPagination />}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          "& .RaList-main": {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
            "& .MuiCardContent-root": {
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: 0,
              overflow: "hidden",
            },
          },
          "& .RaList-content": {
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
          ".RaList-actions": {
            display: "flex",
            justifyContent: "flex-start",
            px: 2,
            flexShrink: 0,
          },
        }}
      >
        <Box sx={{ 
          flex: 1,
          width: "100%",
          overflowX: "auto",
          overflowY: "auto",
          position: "relative",
          "& table": {
            minWidth: "max-content", // Let table size naturally based on content
          },
          "&::-webkit-scrollbar": {
            width: "10px",
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "5px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "#f1f1f1",
          },
        }}>
        <DatagridConfigurable
          sx={{
            ...customDatagridStyle,
            "& .RaDatagrid-row": {
              padding: "0",
            },
            "& .RaDatagrid-cell": {
              padding: "4px 8px",
              whiteSpace: "nowrap",
            },
            " .th": {
              padding: "4px 8px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              color: "rgba(0, 0, 0, 0.54)",
              backgroundColor: "#f5f5f5",
              whiteSpace: "nowrap",
            },
            "& table": {
              tableLayout: "auto",
            },
          }}
          bulkActionButtons={false}
          rowClick="show"
        >
        <TextField source="id" label="ID" />
        
        <FunctionField
          label="Status"
          render={(record: RaRecord) => (
            <Chip
              label={record.application_status}
              size="small"
              sx={{
                backgroundColor: statusColors[record.application_status] || '#9e9e9e',
                color: getContrastColor(statusColors[record.application_status] || '#9e9e9e'),
                fontWeight: 'bold',
              }}
            />
          )}
        />
        
        <FunctionField
          label="Applicant Name"
          render={(record: RaRecord) => 
            `${record.applicant_first_name} ${record.applicant_last_name}`
          }
        />
        
        <EmailField source="applicant_email" label="Email" />
        <TextField source="applicant_phone" label="Phone" />
        
        <FunctionField
          label="Water System"
          render={(record: RaRecord) => 
            record.watersystem?.name || record.system_name || 'N/A'
          }
        />
        
        <TextField source="relationship" label="Relationship" />
        
        <TextField source="school_name" label="School" />
        <DateField source="graduation_date" label="Graduation Date" />
        
        <NumberField source="gpa" label="GPA" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
        <NumberField source="sat_score" label="SAT Score" />
        <NumberField source="act_score" label="ACT Score" />
        
        <TextField source="education_type" label="Education Type" />
        <TextField source="major" label="Major" />
        
        <NumberField source="college_gpa" label="College GPA" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
        <NumberField source="credits_completed" label="Credits Completed" />
        <NumberField source="credits_required" label="Credits Required" />
        
        <FunctionField
          label="Financial Aid"
          render={(record: RaRecord) => {
            const total = (record.financial1_amount || 0) + (record.financial2_amount || 0);
            return total > 0 ? `$${total.toLocaleString()}` : 'N/A';
          }}
        />
        
        <FunctionField
          label="Documents"
          render={(record: RaRecord) => {
            const docs = [];
            if (record.transcript) docs.push('T');
            if (record.test_scores) docs.push('S');
            if (record.recommendation_letter_1) docs.push('R1');
            if (record.recommendation_letter_2) docs.push('R2');
            if (record.essay) docs.push('E');
            if (record.biography) docs.push('B');
            if (record.photograph) docs.push('P');
            return docs.length > 0 ? docs.join(', ') : 'None';
          }}
        />
        
        <DateField source="submission_date" label="Submitted" />
        <DateField source="createdAt" label="Created" />
        
        <FunctionField
          label="Certification"
          render={(record: RaRecord) => (
            <Chip
              label={record.applicant_certification ? 'Certified' : 'Not Certified'}
              size="small"
              color={record.applicant_certification ? 'success' : 'default'}
            />
          )}
        />
      </DatagridConfigurable>
      </Box>
    </List>
    </Box>
  );
};

export default ScholarshipApplicationList;
