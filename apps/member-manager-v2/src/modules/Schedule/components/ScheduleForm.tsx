import React, { useContext, useState } from "react";
import {Button, Grid, Box} from "@mui/material";
import { TextInput, NumberInput, DateInput } from "react-admin";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";
import { ConferenceContext } from "../../conference/ConferenceContext";

interface ConferenceScheduleFormProps {
  record?: any;
  onSave: (data: any) => void;
  onDelete: () => void;
}

const ScheduleForm: React.FC<ConferenceScheduleFormProps> = ({
  record,
  onSave,
  onDelete,
}) => {

  const { conferenceId: conference, year, conferences, conferenceIndex} = useContext(ConferenceContext);
  const form = useFormContext();

  const conferenceStartDate = Array.isArray(conferences) && conferences[conferenceIndex]
  ? conferences[conferenceIndex].start_date
  : null;


  const parseTimeString = (timeString: string | null): Dayjs | null => {
    if (!timeString) return null;
    const [hours, minutes, seconds] = timeString.split(":");
    const [sec] = seconds.split(".");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(parseInt(sec, 10));
    return dayjs(date);
  };

  const [startTime, setStartTime] = useState<Dayjs | null>(
    record?.start ? parseTimeString(record.start) : null
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(
    record?.end ? parseTimeString(record.end) : null
  );

  const handleSave = () => {
    const updatedRecord = {
      id: record?.id,
      conference,
      year,
      ...form.getValues(),
      start: startTime ? startTime.format("HH:mm:ss") : null,
      end: endTime ? endTime.format("HH:mm:ss") : null,
    };
    onSave(updatedRecord);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <DateInput
            source="date"
            label="Date"
            fullWidth
            // conference[conferenceIndex].start_date
            defaultValue={record?.date ?? conferenceStartDate}
            helperText={false}
          />
        </Grid>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid xs={12} sm={3}>
            <TimeField
              fullWidth
              label="Start Time"
              value={startTime}
              onChange={(newValue: Dayjs | null) => setStartTime(newValue)}
              format="hh:mm A"
              helperText={false}
            />
          </Grid>
          <Grid xs={12} sm={3}>
            <TimeField
              fullWidth
              label="End Time"
              value={endTime}
              onChange={(newValue: Dayjs | null) => setEndTime(newValue)}
              format="hh:mm A"
              helperText={false}
            />
          </Grid>
        </LocalizationProvider>
        <Grid xs={12} sm={12}>
          <TextInput
            source="event"
            label="Event"
            fullWidth
            defaultValue={record?.event}
            helperText={false}
            multiline
            rows={4}
          />
        </Grid>
        <Grid xs={12} sm={12}>
          <TextInput
            source="description"
            label="Description"
            fullWidth
            multiline
            rows={5}
            defaultValue={record?.description}
            helperText={false}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextInput
            source="company"
            label="Company"
            fullWidth
            defaultValue={record?.company}
            helperText={false}
            multiline
            rows={4}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextInput
            source="speaker"
            label="Speaker"
            fullWidth
            defaultValue={record?.speaker}
            helperText={false}
            multiline
            rows={4}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextInput
            source="location"
            label="Location"
            fullWidth
            defaultValue={record?.location}
            helperText={false}
            multiline
            rows={4}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <NumberInput
            fullWidth
            source="training_hours"
            label="Training Hours"
            defaultValue={record?.training_hours}
            helperText={false}
          />
        </Grid>
        <Grid xs={12} display="flex" justifyContent="space-between">
          <Button
            sx={{
              width: "48%",
            }}
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
          {record && record.id && (
            <Button
              sx={{
                width: "48%",
              }}
              variant="contained"
              color="error"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduleForm;
