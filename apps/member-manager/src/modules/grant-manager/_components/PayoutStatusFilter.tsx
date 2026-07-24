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
        {legendData?.map((legend, i) => (
          <FormControlLabel
            key={`conference-${i}`}
            sx={coloredSurfaceSx(legend.color || "#cccccc", {
              px: 1,
              my: 0.25,
              borderRadius: 0.5,
              "& .MuiRadio-root": { color: "inherit" },
              "& .Mui-checked": { color: "inherit" },
            })}
            value={payoutStatusId}
            control={<Radio />}
            label={legend.name}
            checked={legend.id === payoutStatusId}
            onChange={() => setPayoutStatusId(legend.id)}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default PayoutStatusFilter;
