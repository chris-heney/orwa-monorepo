import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useScheduleContext } from "./ScheduleProvider";
import dayjs from "dayjs";

import { ScheduleItem } from "./types";
import ConferenceScheduleCard from "../Schedule/components/ScheduleCard";
import { groupRecordsByDate } from "../Schedule/utils";
import { useListContext } from "react-admin";
import { useConferenceContext } from "../conference/ConferenceContext";

// CSS for print optimization
const printStyles = `
  @media print {
    @page {
      size: auto;
      margin: 5mm;
    }
    body {
      font-size: 8pt !important;
      line-height: 1.2 !important;
    }
    table {
      border-collapse: collapse !important;
    }
    th, td {
      padding: 1px 3px !important;
      font-size: 8pt !important;
      vertical-align: top !important;
      border: 1px solid rgba(224, 224, 224, 0.8) !important;
    }
    tr {
      page-break-inside: avoid !important;
    }
    /* Override alternating row colors for merged cells */
    tr[class^="time-slot-"] {
      background-color: inherit !important;
    }
    /* Ensure entire time slot groups have consistent coloring */
    tr[data-row-index="0"],
    tr[data-row-index="2"],
    tr[data-row-index="4"],
    tr[data-row-index="6"],
    tr[data-row-index="8"],
    tr[data-row-index="10"],
    tr[data-row-index="12"],
    tr[data-row-index="14"],
    tr[data-row-index="16"],
    tr[data-row-index="18"] {
      background-color: white !important;
    }
    tr[data-row-index="0"] td,
    tr[data-row-index="2"] td,
    tr[data-row-index="4"] td,
    tr[data-row-index="6"] td,
    tr[data-row-index="8"] td,
    tr[data-row-index="10"] td,
    tr[data-row-index="12"] td,
    tr[data-row-index="14"] td,
    tr[data-row-index="16"] td,
    tr[data-row-index="18"] td {
      background-color: white !important;
    }
    tr[data-row-index="1"],
    tr[data-row-index="3"],
    tr[data-row-index="5"],
    tr[data-row-index="7"],
    tr[data-row-index="9"],
    tr[data-row-index="11"],
    tr[data-row-index="13"],
    tr[data-row-index="15"],
    tr[data-row-index="17"],
    tr[data-row-index="19"] {
      background-color: #F3F2F2 !important;
    }
    tr[data-row-index="1"] td,
    tr[data-row-index="3"] td,
    tr[data-row-index="5"] td,
    tr[data-row-index="7"] td,
    tr[data-row-index="9"] td,
    tr[data-row-index="11"] td,
    tr[data-row-index="13"] td,
    tr[data-row-index="15"] td,
    tr[data-row-index="17"] td,
    tr[data-row-index="19"] td {
      background-color: #F3F2F2 !important;
    }
    h6, .MuiTypography-subtitle1 {
      margin: 3px 0 !important;
      font-size: 10pt !important;
    }
    .MuiBox-root {
      margin-bottom: 4px !important;
    }
    .MuiTypography-root {
      font-size: 8pt !important;
      line-height: 1.2 !important;
    }
    .MuiDivider-root {
      margin: 1px 0 !important;
    }
    .MuiChip-root {
      height: 14px !important;
      font-size: 6pt !important;
    }
    .MuiChip-label {
      padding: 0 4px !important;
    } 
  }
`;

// Define interface for column widths
interface ColumnWidths {
  time: string;
  location: string;
  event: string;
  description?: string;
  speaker?: string;
  company?: string;
  edit: string;
}

const ScheduleList: React.FC = () => {

  const { filterValues } = useListContext();
  const { conferences } = useConferenceContext();
  const { records, targetRef, handleEdit, printView } = useScheduleContext();
  const groupedRecords = groupRecordsByDate(records as ScheduleItem[]);

  // Function to check if any records for a given date have speaker, company, or description content
  const checkForContentColumns = (dateRecords: ScheduleItem[]) => {
    const hasSpeakerContent = dateRecords.some(record => record.speaker && record.speaker.trim() !== '');
    const hasCompanyContent = dateRecords.some(record => record.company && record.company.trim() !== '');
    const hasDescriptionContent = dateRecords.some(record => record.description && record.description.trim() !== '');
    return { hasSpeakerContent, hasCompanyContent, hasDescriptionContent };
  };

  // Common table header style
  const headerStyle = {
    "& th": {
      backgroundColor: "#363636",
      color: "white",
      fontWeight: 700,
      border: "1px solid white",
      padding: "3px 4px", // Reduced padding
      fontSize: "0.75rem",
      height: "22px", // Reduced height
    },
  };

  // Determine column widths based on which columns we're showing
  const getColumnWidths = (showDescription: boolean, showSpeaker: boolean, showCompany: boolean): ColumnWidths => {
    // Calculate how many content columns are visible
    const visibleColumns = (showDescription ? 1 : 0) + (showSpeaker ? 1 : 0) + (showCompany ? 1 : 0);
    
    // Base widths that will be adjusted based on visible columns
    const baseWidths: ColumnWidths = {
      time: "15%",
      location: "15%",
      event: "25%",
      edit: "5%",
    };
    
    // Add widths for visible columns
    if (showDescription) {
      baseWidths.description = visibleColumns === 1 ? "40%" : (visibleColumns === 2 ? "25%" : "15%");
    }
    
    if (showSpeaker) {
      baseWidths.speaker = visibleColumns === 1 ? "40%" : (visibleColumns === 2 ? "25%" : "15%");
    }
    
    if (showCompany) {
      baseWidths.company = visibleColumns === 1 ? "40%" : (visibleColumns === 2 ? "25%" : "15%");
    }
    
    // If no content columns are visible, expand event column
    if (visibleColumns === 0) {
      baseWidths.event = "65%";
    }
    
    return baseWidths;
  };


  // if (!filterValues?.conference || !filterValues?.year) {
  //   return <Box>
  //     <Typography>
  //       No conference or year selected
  //     </Typography>
  //   </Box>
  // }

  return (
    <Box ref={targetRef} sx={{ p: printView ? 0 : 1 }}>
      {printView && (
        <style>
          {printStyles}
        </style>
      )}
      <Typography
        variant={printView ? "subtitle1" : "h6"}
        sx={{
          textAlign: "center",
          fontWeight: 700,
          mb: printView ? 0.5 : 1,
          fontSize: printView ? "1rem" : "1.5rem",
          color: printView ? "#000" : "#262626",
        }}
      >
        ORWA {conferences.find((conference) => conference.id === filterValues?.conference)?.name} - {filterValues?.year} Schedule
      </Typography>
      {Object.keys(groupedRecords).map((date) => {
        // Check if this date's records contain speaker, company, or description content
        const { hasSpeakerContent, hasCompanyContent, hasDescriptionContent } = checkForContentColumns(groupedRecords[date]);
        const columnWidths = getColumnWidths(hasDescriptionContent, hasSpeakerContent, hasCompanyContent);

        return (
          <Box key={date} sx={{ mb: printView ? 0.5 : 1 }}>
            <Typography
              variant={printView ? "subtitle1" : "h6"}
              sx={{
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {dayjs(date).format("dddd, MMMM D")}
            </Typography>
            <Table
              size="small"
              padding="none"
              sx={{
                "& .MuiTableCell-root": {
                  padding: "1px 4px", // Reduced padding
                  verticalAlign: "top",
                },
                borderCollapse: "collapse",
                width: "100%",
                "& tbody tr:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <TableHead>
                <TableRow sx={headerStyle}>
                  <TableCell width={columnWidths.time}>Time</TableCell>
                  <TableCell width={columnWidths.location}>Location</TableCell>
                  <TableCell width={columnWidths.event}>Event</TableCell>
                  {hasDescriptionContent && (
                    <TableCell width={columnWidths.description}>
                      Description
                    </TableCell>
                  )}
                  {hasSpeakerContent && (
                    <TableCell width={columnWidths.speaker}>Speaker</TableCell>
                  )}
                  {hasCompanyContent && (
                    <TableCell width={columnWidths.company}>Company</TableCell>
                  )}
                  {!printView && (
                    <TableCell align="center" width={columnWidths.edit}>
                      Edit
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedRecords[date].map((record, index) => (
                  <ConferenceScheduleCard
                    printView={printView}
                    handleEdit={handleEdit}
                    key={record.id}
                    record={record}
                    showDescription={hasDescriptionContent}
                    showSpeaker={hasSpeakerContent}
                    showCompany={hasCompanyContent}
                    rowIndex={index}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        );
      })}
    </Box>
  );
};

export default ScheduleList;
