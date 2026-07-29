import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import ConferenceScheduleCard from "../components/ScheduleCard";
import dayjs from "dayjs";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { useGetSchedule } from "../helpers/API";
import { printStyles, headerStyle, cellStyle, getColumnWidths } from "../components/ScheduleStyles";
import { generateSchedulePDF, checkForContentColumns, groupRecordsByDate } from "../helpers/pdfGenerator";

const Schedule = () => {
  const { conference } = useConferenceKioskProvider();
  const { data: schedule, loading: isScheduleLoading } = useGetSchedule();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isScheduleLoading) {
    return <CircularProgress />;
  }

  const groupedRecords = groupRecordsByDate(schedule);

  // Handle PDF generation when the download button is clicked
  const handleDownloadPDF = () => {
    if (schedule.length === 0) {
      console.error("No schedule data available to generate PDF");
      return;
    }
    generateSchedulePDF(schedule, conference.name || "Annual Conference");
  };

  return (
    <main className="flex flex-col text-center">
      <Box sx={{ color: "#000000" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <Button
            sx={{
              backgroundColor: "#262626",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#F3F2F2",
                color: "black",
              },
              px: 2,
              py: 0.75,
            }}
            size="small"
            variant="contained"
            startIcon={<DownloadIcon fontSize="small" />}
            onClick={handleDownloadPDF}
          >
            Download Schedule
          </Button>
        </Box>
        <Box>
          <style>{printStyles}</style>
          {Object.keys(groupedRecords).map((date) => {
            // Check if this date's records contain speaker, company, or description content
            const {
              hasSpeakerContent,
              hasCompanyContent,
              hasDescriptionContent,
            } = checkForContentColumns(groupedRecords[date]);
            // Get column widths
            const columnWidths = getColumnWidths(
              hasDescriptionContent,
              hasSpeakerContent,
              hasCompanyContent
            );

            return (
              <Box key={date} sx={{ mb: 1 }}>
                {/* Date Header */}
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    fontWeight: 700,
                    mb: isMobile ? 1 : 0.5,
                  }}
                >
                  {dayjs(date).format("dddd, MMMM D")}
                </Typography>

                {isMobile ? (
                  /* Mobile View using ScheduleCard component */
                  <Box sx={{ mt: 1 }}>
                    {groupedRecords[date].map((record) => (
                      <ConferenceScheduleCard key={record.id} record={record} />
                    ))}
                  </Box>
                ) : (
                  /* Desktop Schedule Table */
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
                        <TableCell width={columnWidths.location}>
                          Location
                        </TableCell>
                        <TableCell width={columnWidths.event}>Event</TableCell>
                        {hasDescriptionContent && (
                          <TableCell width={columnWidths.description}>
                            Description
                          </TableCell>
                        )}
                        {hasSpeakerContent && (
                          <TableCell width={columnWidths.speaker}>
                            Speaker
                          </TableCell>
                        )}
                        {hasCompanyContent && (
                          <TableCell width={columnWidths.company}>
                            Company
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {groupedRecords[date].map((record, rowIndex) => {
                        // Format time with AM/PM for both views
                        const startTime = isNaN(
                          new Date(`${record.date}T${record.start}`).getTime()
                        )
                          ? "N/A"
                          : new Date(
                              `${record.date}T${record.start}`
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            });

                        const endTime = isNaN(
                          new Date(`${record.date}T${record.end}`).getTime()
                        )
                          ? "N/A"
                          : new Date(
                              `${record.date}T${record.end}`
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            });
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
                          descriptions.length > 0 && hasDescriptionContent
                            ? descriptions.length
                            : 0,
                          speakers.length > 0 && hasSpeakerContent
                            ? speakers.length
                            : 0,
                          companies.length > 0 && hasCompanyContent
                            ? companies.length
                            : 0
                        );

                        // Generate a unique class name for this time slot
                        const timeSlotClass = `time-slot-${record.id}`;

                        // Define row style based on rowIndex for proper alternating colors
                        const isOdd = rowIndex % 2 === 1;
                        const rowColor = isOdd ? "#F3F2F2" : "white";

                        const rowStyle = {
                          "& td": cellStyle,
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
                                  <>{timeDisplay}</>
                                  {record.training_hours && (
                                    <Chip
                                      label={`Training Hours: ${record.training_hours}`}
                                      size="small"
                                      sx={{
                                        height: "18px",
                                        fontSize: "0.65rem",
                                        backgroundColor: "#007AFF",
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
                              {hasDescriptionContent && (
                                <TableCell>{descriptions[0] || ""}</TableCell>
                              )}
                              {hasSpeakerContent && (
                                <TableCell>{speakers[0] || ""}</TableCell>
                              )}
                              {hasCompanyContent && (
                                <TableCell>{companies[0] || ""}</TableCell>
                              )}
                            </TableRow>
                          );

                          // Add subsequent rows without the time cell
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
                                {hasDescriptionContent && (
                                  <TableCell>{descriptions[i] || ""}</TableCell>
                                )}
                                {hasSpeakerContent && (
                                  <TableCell>{speakers[i] || ""}</TableCell>
                                )}
                                {hasCompanyContent && (
                                  <TableCell>{companies[i] || ""}</TableCell>
                                )}
                              </TableRow>
                            );
                          }

                          return <>{rows}</>;
                        }

                        // For single entry rows, we'll use the original layout
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
                                <>{timeDisplay}</>
                                {record.training_hours && (
                                  <Chip
                                    label={`Training Hours: ${record.training_hours}`}
                                    size="small"
                                    sx={{
                                      height: "18px",
                                      fontSize: "0.65rem",
                                      backgroundColor: "#007AFF",
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
                            <TableCell>{record.location}</TableCell>
                            <TableCell>{record.event}</TableCell>
                            {hasDescriptionContent && (
                              <TableCell>{record.description}</TableCell>
                            )}
                            {hasSpeakerContent && (
                              <TableCell>{record.speaker}</TableCell>
                            )}
                            {hasCompanyContent && (
                              <TableCell>{record.company}</TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </main>
  );
};

export default Schedule;
