import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useGrantContext } from "../GrantContextProvider";

const SelectFiscalYearRange = () => {
  const { setFiscalYearStart, setFiscalYearEnd, fiscalYearEnd, fiscalYearStart } = useGrantContext();
  const [selectedRange, setSelectedRange] = useState<string>("");

  useEffect(() => {

    if (fiscalYearStart && fiscalYearEnd) {
      setSelectedRange(`FY ${fiscalYearStart.split("-")[0]} (${fiscalYearStart} - ${fiscalYearEnd})`);
    }
    
  }, []);
  // Generate fiscal years starting from 2021 up to the current year + 5
  const generateFiscalYears = () => {
    const startYear = 2022;
    const currentYear = new Date().getFullYear() + 1;
    // const range = currentYear - startYear;
    const years = [];

    for (let year = startYear; year < currentYear; year++) {
      const fiscalStart = `${year}-07-01`;
      const fiscalEnd = `${year + 1}-06-30`;
      years.push({
        label: `FY ${year} (${fiscalStart} - ${fiscalEnd})`,
        start: fiscalStart,
        end: fiscalEnd,
      });
    }

    return years;
  };

  const fiscalYears = generateFiscalYears();

  const handleRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = fiscalYears.find(
      (year) => year.label === event.target.value
    );
    if (selected) {
      setSelectedRange(selected.label);
      setFiscalYearStart(selected.start);
      setFiscalYearEnd(selected.end);
    }
  };

  const resetRange = () => {
    setSelectedRange("");
    setFiscalYearStart(null);
    setFiscalYearEnd(null);
  };

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <FormLabel>Fiscal Year Range</FormLabel>
        {selectedRange && (
          <Button
            onClick={resetRange}
            variant="outlined"
            color="secondary"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Reset
          </Button>
        )}
      </Box>

      <FormControl fullWidth sx={{ mt: 1 }}>
        <Select
          value={selectedRange}
          onChange={(e) =>
            handleRangeChange(e as React.ChangeEvent<{ value: unknown }>)
          }
          displayEmpty
          renderValue={(value) => (value ? value : "Select Fiscal Year")}
        >
          <MenuItem value="" disabled>
            Select Fiscal Year
          </MenuItem>
          {fiscalYears.map((year) => (
            <MenuItem key={year.label} value={year.label}>
              {year.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedRange && (
        <Typography variant="subtitle2" mt={2}>
          Selected Fiscal Year
          <Divider />
          <p>{selectedRange}</p>
        </Typography>
      )}
    </Box>
  );
};

export default SelectFiscalYearRange;
