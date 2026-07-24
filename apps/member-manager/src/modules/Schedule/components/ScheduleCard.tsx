import React from "react";
import {
  TableCell,
  TableRow,
  IconButton,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import { ScheduleItem } from "../types";

interface ConferenceScheduleCardProps {
  record: ScheduleItem;
  handleEdit: (record: ScheduleItem) => void;
  printView: boolean;
  showDescription?: boolean;
  showSpeaker?: boolean;
  showCompany?: boolean;
  rowIndex?: number;
}

const ConferenceScheduleCard: React.FC<ConferenceScheduleCardProps> = ({
  record,
  handleEdit,
  printView,
  showDescription = true,
  showSpeaker = true,
  showCompany = true,
  rowIndex = 0,
}) => {
  // Format time with AM/PM for both views
  const startTime = dayjs(record.start, "HH:mm:ss").isValid()
    ? dayjs(record.start, "HH:mm:ss").format("h:mm A")
    : "N/A";
  const endTime = dayjs(record.end, "HH:mm:ss").isValid()
    ? dayjs(record.end, "HH:mm:ss").format("h:mm A")
    : "N/A";
  const timeDisplay = `${startTime} - ${endTime}`;

  const splitContent = (content: string) => {
    return content ? content.split("\n") : [];
  };

  const locations = splitContent(record.location);
  const events = splitContent(record.event);
  const descriptions = splitContent(record.description);
  const speakers = splitContent(record.speaker);
  const companies = splitContent(record.company);

  // Determine if we need to show multiple entries
  const hasMultipleEntries =
    speakers.length > 1 ||
    companies.length > 1 ||
    events.length > 1 ||
    locations.length > 1 ||
    descriptions.length > 1;

  // Maximum number of entries across all columns for alignment
  const maxEntries = Math.max(
    locations.length,
    events.length,
    descriptions.length > 0 && showDescription ? descriptions.length : 0,
    speakers.length > 0 && showSpeaker ? speakers.length : 0,
    companies.length > 0 && showCompany ? companies.length : 0
  );

  // Generate a unique class name for this time slot
  const timeSlotClass = `time-slot-${record.id}`;
  
  const theme = useTheme();

  // Common styles for table cells
  const cellStyle = {
    border: `1px solid ${theme.palette.divider}`,
    padding: "4px",
    fontSize: "0.75rem",
    lineHeight: 1.2,
    verticalAlign: "top",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  // Alternating rows: light zebra in light mode, subtle hover tone in dark
  const isOdd = rowIndex % 2 === 1;
  const rowColor =
    theme.palette.mode === "dark"
      ? isOdd
        ? theme.palette.action.hover
        : theme.palette.background.paper
      : isOdd
        ? "#F3F2F2"
        : theme.palette.common.white;

  const rowStyle = {
    "& td": {
      ...cellStyle,
      color: printView ? undefined : theme.palette.text.primary,
    },
    backgroundColor: rowColor,
  };

  // If we have multiple entries, use a different approach with rowspan
  if (hasMultipleEntries && maxEntries > 1) {
    // Create a first row with the time information and rowspan
    const rows = [];
    
    // First row contains the time cell with rowspan
    rows.push(
      <TableRow 
        key={`${record.id}-0`} 
        className={timeSlotClass}
        sx={rowStyle}
        data-row-index={rowIndex}
      >
        <TableCell
          rowSpan={maxEntries}
          sx={{
            verticalAlign: "middle",
            minWidth: "100px",
            padding: "8px 4px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "flex-start",
              width: "calc(100% - 8px)",
            }}
          >
            <>
              {timeDisplay}
            </>
            {record.training_hours && (
              <Chip
                label={`Training Hours: ${record.training_hours}`}
                size="small"
                sx={{
                  height: "18px",
                  fontSize: "0.65rem",
                  backgroundColor: "#1976d2",
                  color: "white",
                  width: "auto",
                  maxWidth: "85%",
                  "& .MuiChip-label": {
                    padding: "0 6px",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    whiteSpace: "nowrap",
                  },
                }}
              />
            )}
          </Box>
        </TableCell>
        <TableCell>{locations[0] || ""}</TableCell>
        <TableCell>{events[0] || ""}</TableCell>
        {showDescription && <TableCell>{descriptions[0] || ""}</TableCell>}
        {showSpeaker && <TableCell>{speakers[0] || ""}</TableCell>}
        {showCompany && <TableCell>{companies[0] || ""}</TableCell>}
        {!printView && (
          <TableCell
            rowSpan={maxEntries}
            align="center"
            sx={{ padding: "0px 4px", verticalAlign: "middle" }}
          >
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(record)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
    );

    // Add subsequent rows without the time or edit cells
    for (let i = 1; i < maxEntries; i++) {
      rows.push(
        <TableRow 
          key={`${record.id}-${i}`} 
          className={timeSlotClass}
          sx={rowStyle}
          data-row-index={rowIndex}
        >
          <TableCell>{locations[i] || ""}</TableCell>
          <TableCell>{events[i] || ""}</TableCell>
          {showDescription && <TableCell>{descriptions[i] || ""}</TableCell>}
          {showSpeaker && <TableCell>{speakers[i] || ""}</TableCell>}
          {showCompany && <TableCell>{companies[i] || ""}</TableCell>}
        </TableRow>
      );
    }

    return <>{rows}</>;
  }

  // For single entry rows, we'll use the original layout but adjust the time cell
  return (
    <TableRow 
      className={timeSlotClass}
      sx={rowStyle}
      data-row-index={rowIndex}
    >
      <TableCell
        sx={{
          verticalAlign: "middle",
          position: "relative",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignItems: "flex-start",
            width: "calc(100% - 8px)",
          }}
        >
          <>
            {timeDisplay}
          </>
          {record.training_hours && (
            <Chip
              label={`Training Hours: ${record.training_hours}`}
              size="small"
              sx={{
                height: "18px",
                fontSize: "0.65rem",
                backgroundColor: "#1976d2",
                color: "white",
                width: "auto",
                maxWidth: "85%",
                "& .MuiChip-label": {
                  padding: "0 6px",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  whiteSpace: "nowrap",
                },
              }}
            />
          )}
        </Box>
      </TableCell>
      <TableCell>{locations[0] || ""}</TableCell>
      <TableCell>{events[0] || ""}</TableCell>
      {showDescription && <TableCell>{descriptions[0] || ""}</TableCell>}
      {showSpeaker && <TableCell>{speakers[0] || ""}</TableCell>}
      {showCompany && <TableCell>{companies[0] || ""}</TableCell>}
      {!printView && (
        <TableCell
          align="center"
          sx={{ padding: "0px 4px", verticalAlign: "middle" }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(record)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ConferenceScheduleCard;
