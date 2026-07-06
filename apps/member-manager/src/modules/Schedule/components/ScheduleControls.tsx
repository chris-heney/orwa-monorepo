import React, { useState } from "react";
import { Box, IconButton, Tooltip, CircularProgress } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy"; // For Duplicate Schedule
import DeleteIcon from "@mui/icons-material/Delete"; // For Clear Schedule
import DownloadIcon from "@mui/icons-material/Download"; // For Download PDF
import VisibilityIcon from "@mui/icons-material/Visibility"; // For Enter Print View
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"; // For Exit Print View
import { useScheduleContext } from "../ScheduleProvider";
import BorderAllIcon from '@mui/icons-material/BorderAll';
// Import type only, not the actual function
import { ScheduleItem } from "../types";
import { useConferenceContext } from "../../conference/ConferenceContext";
import { useListContext } from "react-admin";

const ScheduleControls: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const {
    printView,
    setPrintView,
    toPDF,
    setIsDuplicateModalOpen,
    setIsClearModalOpen,
    records,
  } = useScheduleContext();

  const {filterValues} = useListContext()
  const {conferences} = useConferenceContext()

  const groupRecordsByDate = (records: ScheduleItem[]) => {
    const grouped: Record<string, ScheduleItem[]> = {};
    records
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.start}`);
        const dateB = new Date(`${b.date}T${b.start}`);
        return dateA.getTime() - dateB.getTime();
      })
      .forEach((record) => {
        if (!grouped[record.date]) {
          grouped[record.date] = [];
        }
        grouped[record.date].push(record);
      });
    return grouped;
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const parts = time.split(':');
    if (parts.length < 2) return time;
    
    let hours = parseInt(parts[0], 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    const minutes = parseInt(parts[1], 10);
    return minutes === 0 ? `${hours}${ampm}` : `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleExportToExcel = async () => {
    if (records.length > 0) {
      try {
        setExporting(true);
        const conferenceName = filterValues?.conference 
          ? conferences.find((conference) => conference.id === filterValues.conference)?.name ?? ""
          : "";
          
        const typedRecords = records as ScheduleItem[];
        const groupedRecords = groupRecordsByDate(typedRecords);
        
        // Check which columns have data
        const hasDescriptions = typedRecords.some(record => record.description && record.description.trim() !== '');
        const hasSpeakers = typedRecords.some(record => record.speaker && record.speaker.trim() !== '');
        const hasCompanies = typedRecords.some(record => record.company && record.company.trim() !== '');
        const hasTrainingHours = typedRecords.some(record => record.training_hours !== undefined && record.training_hours > 0);
        
        // Determine which columns to include
        let headers = ['Time', 'Location', 'Event'];
        if (hasDescriptions) headers.push('Description');
        if (hasSpeakers) headers.push('Speaker');
        if (hasCompanies) headers.push('Company');
        if (hasTrainingHours) headers.push('Training Hours');
        
        // Generate CSV content
        let csvContent = headers.join(',') + '\n';
        
        // Add data grouped by date
        Object.entries(groupedRecords).forEach(([date, items]) => {
          // Add date as a header row (add 1 day to fix timezone off-by-one)
          const d = new Date(date);
          d.setDate(d.getDate() + 1);
          const formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
          csvContent += `"${formattedDate}"${','.repeat(headers.length - 1)}\n`;
          
          // Add items for this date
          items.forEach((item: ScheduleItem) => {
            // Format time properly
            let timeString = '';
            if (item.start && item.end) {
              timeString = `${formatTime(item.start)} - ${formatTime(item.end)}`;
            } else if (item.start) {
              timeString = formatTime(item.start);
            } else if (item.end) {
              timeString = formatTime(item.end);
            } else {
              timeString = 'N/A';
            }
            
            // Create row data based on included columns
            const rowData = [];
            rowData.push(`"${timeString}"`);
            rowData.push(`"${item.location || ''}"`);
            rowData.push(`"${item.event || ''}"`);
            if (hasDescriptions) rowData.push(`"${(item.description || '').replace(/"/g, '""')}"`);
            if (hasSpeakers) rowData.push(`"${item.speaker || ''}"`);
            if (hasCompanies) rowData.push(`"${item.company || ''}"`);
            if (hasTrainingHours) rowData.push(`"${item.training_hours || ''}"`);
            
            csvContent += rowData.join(',') + '\n';
          });
          
          // Add a blank row after each date group
          csvContent += '\n';
        });
        
        // Create a downloadable blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Create a link and click it to trigger download
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `ORWA-Schedule-${conferenceName ? conferenceName + '-' : ''}${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Failed to export schedule:", error);
        alert("Failed to export schedule. Please try again or contact support.");
      } finally {
        setExporting(false);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
      <Tooltip title="Duplicate Schedule">
        <IconButton
          size="small"
          sx={{
            backgroundColor: "#262626",
            color: "white",
            "&:hover": { backgroundColor: "#F3F2F2", color: "black" },
          }}
          onClick={() => setIsDuplicateModalOpen(true)}
        >
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Clear Schedule">
        <IconButton
          size="small"
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": { backgroundColor: "#F3F2F2", color: "black" },
          }}
          onClick={() => setIsClearModalOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Enter/Exit Print View">
        <IconButton
          size="small"
          sx={{
            backgroundColor: "#262626",
            color: "white",
            "&:hover": { backgroundColor: "#F3F2F2", color: "black" },
          }}
          onClick={() => setPrintView(!printView)}
        >
          {printView ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </Tooltip>
      {printView && (
        <Tooltip title="Download PDF">
          <IconButton
            size="small"
            sx={{
              backgroundColor: "#262626",
              color: "white",
              "&:hover": { backgroundColor: "#F3F2F2", color: "black" },
            }}
            onClick={toPDF}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      )}
      {/* Export to Excel */}
      <Tooltip title="Export Schedule">
        <IconButton 
          size="small" 
          sx={{ 
            backgroundColor: "#262626", 
            color: "white", 
            "&:hover": { backgroundColor: "#F3F2F2", color: "black" } 
          }}
          onClick={handleExportToExcel}
          disabled={exporting}
        >
          {exporting ? <CircularProgress size={24} color="inherit" /> : <BorderAllIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ScheduleControls;
