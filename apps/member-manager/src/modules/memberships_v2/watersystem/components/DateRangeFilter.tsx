import React, { useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import dayjs from "dayjs"; // Importing day.js for date manipulation
import { useListFilterContext, useStore } from "react-admin";
import CheckIcon from "@mui/icons-material/Check";
import { Clear } from "@mui/icons-material";

type TDateRangeFilterProps = {
  fields: string[]; // The fields that the user can filter by
};

const DateRangeFilter: React.FC<TDateRangeFilterProps> = ({ fields }) => {
  const { filterValues, setFilters, resource} = useListFilterContext();

  // Initialize selected field and dates from the filter context
  const [selectedField, setSelectedField] = useStore<string>(`${resource}-selected-date-field`, fields[0]);
  const [startDate, setStartDate] = useState<string>(
    filterValues[selectedField]?.$between?.[0] || dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(
    filterValues[selectedField]?.$between?.[1] || dayjs().format("YYYY-MM-DD")
  );

  const handleFieldChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedField(event.target.value as string);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    // Ensure the date is in 'YYYY-MM-DD' format
    if (dayjs(value).isValid()) {
      setStartDate(value);
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Ensure the date is in 'YYYY-MM-DD' format
    if (dayjs(value).isValid()) {
      setEndDate(value);
    }
  };

  const applyFilter = () => {
    if (startDate && endDate) {
      setFilters(
        {
          [selectedField]: {
            $between: [
              dayjs(startDate).format("YYYY-MM-DD"),
              dayjs(endDate).format("YYYY-MM-DD"),
            ],
          },
        },
        {
          ...filterValues,
          [selectedField]: {
            $between: [
              dayjs(startDate).format("YYYY-MM-DD"),
              dayjs(endDate).format("YYYY-MM-DD"),
            ],
          },
        }
      );
    }
  };

  const clearFilter = () => {
    setFilters(
      {     
      },
      {
      }
    );
  };

  return (
    <>
      <FormControl fullWidth>
        <Select
          value={selectedField}
          onChange={(e) => handleFieldChange(e as any)}
          label="Field"
          variant="standard"
        >
          {fields.map((field) => (
            <MenuItem key={field} value={field}>
              {field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="textSecondary">
          Select the date to filter by
        </Typography>
      </FormControl>

      <TextField
        label="Start Date"
        type="date"
        variant="standard"
        value={startDate}
        onChange={handleStartDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        InputProps={{
          inputProps: {
            max: dayjs().format("YYYY-MM-DD"), // Optional: restrict future dates
          },
        }}
      />

      <TextField
        label="End Date"
        type="date"
        variant="standard"
        value={endDate}
        onChange={handleEndDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        sx={{ marginTop: 2 }}
        InputProps={{
          inputProps: {
            max: dayjs().format("YYYY-MM-DD"), // Optional: restrict future dates
          },
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Tooltip title="Apply Selected Dates" arrow>
          <IconButton // Button to apply the filter
            onClick={applyFilter}
            color="primary"
          >
            <CheckIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear Filter" arrow>
          <IconButton // Button to apply the filter
            onClick={clearFilter}
            color="error"
          >
            <Clear />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default DateRangeFilter;
