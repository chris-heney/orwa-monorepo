import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Theme,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useGetList } from "react-admin";
import { useGrantContext } from "../GrantContextProvider";
import coloredSurfaceSx from "../../_helpers/coloredSurfaceSx";

const SoonerwarnStatusFilter = () => {
  const { applicationStatuses, setApplicationStatuses } = useGrantContext();
  const { data: legendData } = useGetList("grant-statuses", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "order", order: "ASC" },
  });

  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const handleStatusChange = (statusId: string) => {
    if (applicationStatuses.includes(statusId)) {
      setApplicationStatuses(
        applicationStatuses.filter((status) => status !== statusId)
      );
    } else {
      setApplicationStatuses([...applicationStatuses, statusId]);
    }
  };

  return (
    <Box p={2} width={isSmall ? "90%" : "100%"}>
      <RadioGroup
        value={applicationStatuses}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <FormLabel component="legend">Statuses</FormLabel>
          {applicationStatuses.length !== 0 && (
            <Button
              sx={{ mr: isSmall ? 0 : 1 }}
              onClick={() => {
                setApplicationStatuses([]);
              }}
            >
              Reset
            </Button>
          )}
        </Box>
        {legendData?.map((legend, i) => (
          <FormControlLabel
            key={`status-${i}`}
            sx={coloredSurfaceSx(legend.color || "#cccccc", {
              px: 1,
              my: 0.25,
              borderRadius: 0.5,
              "& .MuiRadio-root": { color: "inherit" },
              "& .Mui-checked": { color: "inherit" },
            })}
            value={legend.id}
            control={
              <Radio onClick={() => handleStatusChange(legend.id.toString())} />
            }
            label={legend.name}
            checked={applicationStatuses.includes(legend.id.toString())}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default SoonerwarnStatusFilter;
