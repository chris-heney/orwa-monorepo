import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
} from "@mui/material";
import { useScheduleContext } from "../ScheduleProvider";
import { useConferenceContext } from "../../conference/ConferenceContext";

const DuplicateScheduleModal: React.FC = () => {
  const {
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    targetConference,
    setTargetConference,
    targetYear,
    setTargetYear,
    handleDuplicateSchedule,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useScheduleContext();

  const [dateError, setDateError] = useState<string>("");

  const { conferences } = useConferenceContext();

  const conferenceYears: number[] = [];
  for (let y = new Date().getFullYear() + 1; y >= 2024; y--) {
    conferenceYears.push(y);
  }

  // Validate dates whenever they change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        setDateError("End date must be after start date");
      } else {
        setDateError("");
      }
    } else if (isDuplicateModalOpen && (!startDate || !endDate)) {
      setDateError("Both start and end dates are required");
    } else {
      setDateError("");
    }
  }, [startDate, endDate, isDuplicateModalOpen]);

  const isFormValid = targetConference && targetYear && startDate && endDate && !dateError;

  return (
    <Modal
      open={isDuplicateModalOpen}
      onClose={() => setIsDuplicateModalOpen(false)}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 450,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#262626",
            color: "white",
            py: 2,
            px: 3,
            fontWeight: 600,
            fontSize: "1.2rem",
            textAlign: "center",
          }}
        >
          Duplicate Schedule
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 2}}>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: 500,
              color: "#333",
              mb: 3,
            }}
          >
            Select Conference and Year to Duplicate To
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="target-conference-label">Conference</InputLabel>
            <Select
              labelId="target-conference-label"
              value={targetConference}
              onChange={(e) => setTargetConference(e.target.value as any)}
            >
              {conferences.map((conf: any) => (
                <MenuItem key={conf.id} value={conf.id}>
                  {conf.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="target-year-label">Year</InputLabel>
            <Select
              labelId="target-year-label"
              value={targetYear}
              onChange={(e) => setTargetYear(Number(e.target.value))}
            >
              {conferenceYears.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
              color: "#333",
              mb: 2,
            }}
          >
            Date Range for New Schedule
          </Typography>

          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
            error={!!dateError}
          />

          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 1 }}
            error={!!dateError}
          />

          {dateError && (
            <FormHelperText error sx={{ mb: 2 }}>
              {dateError}
            </FormHelperText>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button
              sx={{
                backgroundColor: "#262626",
                color: "white",
                fontWeight: 600,
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "#3e3e3e" },
                "&:disabled": { backgroundColor: "#cccccc", color: "#666666" },
              }}
              onClick={handleDuplicateSchedule}
              disabled={!isFormValid}
            >
              Duplicate
            </Button>
            <Button
              sx={{
                backgroundColor: "red",
                color: "white",
                fontWeight: 600,
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "darkred" },
              }}
              onClick={() => setIsDuplicateModalOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DuplicateScheduleModal;