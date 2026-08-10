import React from "react";
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
import { useGetList } from "react-admin";
import { useGrantContext } from "../GrantContextProvider";
import coloredSurfaceSx from "../../_helpers/coloredSurfaceSx";
import { getRelationFilterId } from "../helpers/getRelationFilterId";

const PayoutStatusFilter = () => {
  const { payoutStatusId, setPayoutStatusId } = useGrantContext();

  const { data: legendData } = useGetList("payout-statuses", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "order", order: "ASC" },
  });

  const [selectedValue, setSelectedValue] = React.useState("");
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <Box px={3} width={isSmall ? "90%" : "100%"}>
      <RadioGroup
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <FormLabel component="legend">Legend</FormLabel>
          {payoutStatusId !== 0 && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              onClick={() => setPayoutStatusId(0)}
            >
              Reset
            </Button>
          )}
        </Box>
        {legendData?.map((legend, i) => {
          const statusFilterId = getRelationFilterId(legend);
          if (statusFilterId == null) return null;
          return (
            <FormControlLabel
              key={`payout-status-${statusFilterId}-${i}`}
              sx={coloredSurfaceSx(legend.color || "#cccccc", {
                px: 1,
                my: 0.25,
                borderRadius: 0.5,
                "& .MuiRadio-root": { color: "inherit" },
                "& .Mui-checked": { color: "inherit" },
              })}
              value={statusFilterId}
              control={<Radio />}
              label={legend.name}
              checked={statusFilterId === payoutStatusId}
              onChange={() => setPayoutStatusId(statusFilterId)}
            />
          );
        })}
      </RadioGroup>
    </Box>
  );
};

export default PayoutStatusFilter;
