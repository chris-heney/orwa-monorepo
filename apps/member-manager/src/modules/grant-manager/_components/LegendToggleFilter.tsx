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
import { getRelationFilterId } from "../helpers/getRelationFilterId";

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
        {legendData?.map((legend, i) => {
          const statusFilterId = getRelationFilterId(legend);
          if (statusFilterId == null) return null;
          const statusKey = String(statusFilterId);
          return (
            <FormControlLabel
              key={`status-${statusKey}-${i}`}
              sx={coloredSurfaceSx(legend.color || "#cccccc", {
                px: 1,
                my: 0.25,
                borderRadius: 0.5,
                "& .MuiRadio-root": { color: "inherit" },
                "& .Mui-checked": { color: "inherit" },
              })}
              value={statusKey}
              control={
                <Radio onClick={() => handleStatusChange(statusKey)} />
              }
              label={legend.name}
              checked={applicationStatuses.includes(statusKey)}
            />
          );
        })}
      </RadioGroup>
    </Box>
  );
};

export default SoonerwarnStatusFilter;
