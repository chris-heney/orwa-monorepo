import React from "react";
import {
  TableCell,
  TableRow,
  IconButton,
  Box,
  Chip,
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
  
  // Common styles for table cells
  const cellStyle = {
    border: "1px solid rgba(224, 224, 224, 0.8)",
    padding: "4px",
    fontSize: "0.75rem",
    lineHeight: 1.2,
    verticalAlign: "top",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

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
            <>
              {timeDisplay}
            </>
            {record.training_hours && (
              <Chip
                label={`Training: ${record.training_hours}`}
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
              label={`Training: ${record.training_hours}`}
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

  return (
    <Box ref={targetRef} sx={{ p: printView ? 0 : 1 }}>
      {printView && (
        <style>
          {printStyles}
        </style>
      )}
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


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { useNotify, useDataProvider, Loading, RaRecord } from "react-admin";
import { useConferenceContext } from "../conference/ConferenceContext";
import { Margin, Resolution, usePDF } from "react-to-pdf";
import { clearSchedule, duplicateSchedule, handleDeleteScheduleItem, handleSaveScheduleItem } from "./scheduleService";


interface ScheduleContextProps {
  records: RaRecord[];
  setRecords: (records: RaRecord[]) => void;
  loading: boolean;
  editingRecord: RaRecord | null;
  setEditingRecord: React.Dispatch<React.SetStateAction<RaRecord | null>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  printView: boolean;
  setPrintView: React.Dispatch<React.SetStateAction<boolean>>;
  toPDF: () => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
  handleEdit: (record: RaRecord) => void;
  handleClose: () => void;
  isDuplicateModalOpen: boolean;
  setIsDuplicateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isClearModalOpen: boolean;
  setIsClearModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetConference: number | null;
  setTargetConference: React.Dispatch<React.SetStateAction<number | null>>;
  targetYear: number;
  setTargetYear: React.Dispatch<React.SetStateAction<number>>;
  handleDelete: () => void;
  handleSave: (formData: any) => void;
  handleClearSchedule: () => void;
  handleDuplicateSchedule: () => void;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScheduleContext = createContext<ScheduleContextProps>({
  records: [],
  setRecords: () => {},
  loading: true,
  editingRecord: null,
  setEditingRecord: () => {},
  isCreating: false,
  setIsCreating: () => {},
  printView: false,
  setPrintView: () => {},
  toPDF: () => {},
  targetRef: React.createRef<HTMLDivElement>(),
  handleEdit: () => {},
  handleClose: () => {},
  isDuplicateModalOpen: false,
  setIsDuplicateModalOpen: () => {},
  isClearModalOpen: false,
  setIsClearModalOpen: () => {},
  targetConference: null,
  setTargetConference: () => {},
  targetYear: new Date().getFullYear(),
  setTargetYear: () => {},
  handleDelete: () => {},
  handleSave: () => {},
  handleClearSchedule: () => {},
  handleDuplicateSchedule: () => {},
  saving: false,
  setSaving: () => {},
});

export const useScheduleContext = () => useContext(ScheduleContext);

const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const {
    conferenceId: conference,
    year,
    searchFilter,
    conferences,
    conferenceIndex,
    isCreating,
    setIsCreating,
  } = useConferenceContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [printView, setPrintView] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [targetConference, setTargetConference] = useState<number | null>(conference as number);
  const [targetYear, setTargetYear] = useState<number>(
    new Date().getFullYear()
  );
  const [saving, setSaving] = useState(false);

  const { toPDF, targetRef } = usePDF({
    filename: `${
      conferenceIndex > -1
        ? conferences[conferenceIndex].name
        : "All Conference"
    }-schedule-${year}`,
    resolution: Resolution.HIGH,
    page: { margin: Margin.SMALL },
  });

  useEffect(() => {
    setLoading(true);
    dataProvider
      .getList("conference-schedules", {
        filter: { conference, year, ...searchFilter },
        pagination: { page: 1, perPage: 100 },
        sort: { field: "id", order: "ASC" },
      })
      .then(({ data }) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        notify(`Error: ${error.message}`, { type: "error" });
        setLoading(false);
      });
  }, [conference, year, searchFilter, dataProvider, notify]);

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsCreating(true);
  };

  const handleClose = () => {
    setEditingRecord(null);
    setIsCreating(false);
  };

  const handleSave = (formData: any) => {
    handleSaveScheduleItem(
      formData,
      setSaving,
      setRecords,
      setIsCreating,
      setEditingRecord,
      notify,
      dataProvider,
      records,
      conference,
      year,
      searchFilter
    );
  };

  const handleDelete = () => {
    handleDeleteScheduleItem(
      editingRecord,
      setSaving,
      dataProvider,
      notify,
      setRecords,
      setIsCreating,
      setEditingRecord
    );
  };

  const handleDuplicateSchedule = () => {
    duplicateSchedule(
      dataProvider,
      conference,
      year,
      targetConference,
      targetYear,
      notify
    ).then(() => {
      setIsDuplicateModalOpen(false);
    });
  };

  const handleClearSchedule = () => {
    clearSchedule(dataProvider, conference, year, notify).then(() => {
      setRecords([]);
      setIsClearModalOpen(false);
    });
  };

  return !conference ? (
    <Loading />
  ) : (
    <ScheduleContext.Provider
      value={{
        records,
        setRecords,
        loading,
        editingRecord,
        setEditingRecord,
        isCreating,
        setIsCreating,
        printView,
        setPrintView,
        toPDF,
        targetRef,
        handleEdit,
        handleClose,
        isDuplicateModalOpen,
        setIsDuplicateModalOpen,
        isClearModalOpen,
        setIsClearModalOpen,
        targetConference,
        setTargetConference,
        targetYear,
        setTargetYear,
        handleDelete,
        handleSave,
        handleClearSchedule,
        handleDuplicateSchedule,
        saving,
        setSaving,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleProvider;
