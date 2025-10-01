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
  'Winner': '#4caf50',
  'Runner Up': '#8bc34a',
  'Not Selected': '#f44336',
};

const awardTypeColors: Record<string, string> = {
  'Water/Wastewater System of the Year': '#1976d2',
  'Excellence in Operations': '#388e3c',
  'Excellence in Management': '#7b1fa2',
  'Excellence in Office Operations': '#f57c00',
};

const AwardListActions = () => (
  <TopToolbar>
    <FilterLiveSearch />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

interface AwardNominationListProps {
  filter?: any;
}

const AwardNominationList = ({ filter = {} }: AwardNominationListProps) => {
  const refresh = useRefresh();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      maxWidth: "100%",
    }}>
      <List
        title=" "
        resource="award-nominations"
        actions={<AwardListActions />}
        filter={filter}
        queryOptions={{
          meta: {
            raw: true,
            populate: ['contact', 'watersystem', 'supporting_documents', 'nomination_pdf'],
          },
        }}
        sort={{ field: "submission_date", order: "DESC" }}
        perPage={50}
        pagination={<CustomPagination />}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: "100%",
          "& .RaList-main": {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
            maxWidth: "100%",
            "& .MuiCardContent-root": {
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: 0,
              overflow: "hidden",
              maxWidth: "100%",
            },
          },
          "& .RaList-content": {
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
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
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "auto",
          position: "relative",
          "& table": {
            minWidth: "max-content",
            tableLayout: "auto",
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
            backgroundColor: "background.default",
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
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            " .th": {
              padding: "4px 8px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              color: "text.secondary",
              backgroundColor: "background.default",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            },
            "& table": {
              tableLayout: "auto",
              width: "100%",
            },
          }}
          bulkActionButtons={false}
          rowClick="show"
        >
          <TextField source="id" label="ID" />
          
          <NumberField source="award_year" label="Year" />
          
          <FunctionField
            label="Status"
            render={(record: RaRecord) => (
              <Chip
                label={record.nomination_status}
                size="small"
                sx={{
                  backgroundColor: statusColors[record.nomination_status] || '#9e9e9e',
                  color: getContrastColor(`${statusColors[record.nomination_status] || '#9e9e9e'}` as `#${string}`),
                  fontWeight: 'bold',
                }}
              />
            )}
          />
          
          <FunctionField
            label="Award Type"
            render={(record: RaRecord) => (
              <Chip
                label={record.award_type}
                size="small"
                sx={{
                  backgroundColor: awardTypeColors[record.award_type] || '#757575',
                  color: '#fff',
                  fontSize: '0.75rem',
                }}
              />
            )}
          />
          
          <TextField source="nominee_name" label="Nominee/System" />
          
          <FunctionField
            label="Water System"
            render={(record: RaRecord) => 
              record.watersystem?.name || record.system_name || 'N/A'
            }
          />
          
          <TextField source="county" label="County" />
          
          <FunctionField
            label="Contact"
            render={(record: RaRecord) => (
              <Box>
                <Box sx={{ fontSize: '0.875rem' }}>{record.email}</Box>
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{record.daytime_phone}</Box>
              </Box>
            )}
          />
          
          <FunctionField
            label="Location"
            render={(record: RaRecord) => 
              `${record.city}, ${record.state}`
            }
          />
          
          <FunctionField
            label="Members"
            render={(record: RaRecord) => {
              if (record.current_members || record.beginning_members) {
                return (
                  <Box>
                    <Box sx={{ fontSize: '0.875rem' }}>Current: {record.current_members || 'N/A'}</Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Initial: {record.beginning_members || 'N/A'}</Box>
                  </Box>
                );
              }
              return 'N/A';
            }}
          />
          
          <FunctionField
            label="Employees"
            render={(record: RaRecord) => {
              const total = (record.clerical_employees || 0) + 
                           (record.operation_maintenance_employees || 0) + 
                           (record.management_employees || 0);
              if (total > 0) {
                return (
                  <Box>
                    <Box sx={{ fontSize: '0.875rem' }}>Total: {total}</Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      C: {record.clerical_employees || 0} | 
                      O: {record.operation_maintenance_employees || 0} | 
                      M: {record.management_employees || 0}
                    </Box>
                  </Box>
                );
              }
              return 'N/A';
            }}
          />
          
          <DateField source="operation_start_date" label="Operation Start" />
          <DateField source="employment_date" label="Employment Date" />
          
          <FunctionField
            label="Documents"
            render={(record: RaRecord) => {
              const docs = [];
              if (record.nomination_pdf) docs.push('PDF');
              if (record.supporting_documents?.length > 0) {
                docs.push(`${record.supporting_documents.length} Files`);
              }
              return docs.length > 0 ? docs.join(', ') : 'None';
            }}
          />
          
          <DateField source="submission_date" label="Submitted" />
          <DateField source="createdAt" label="Created" />
        </DatagridConfigurable>
        </Box>
      </List>
    </Box>
  );
};

export default AwardNominationList;
