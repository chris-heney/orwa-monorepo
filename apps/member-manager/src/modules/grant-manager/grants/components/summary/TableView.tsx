import React, { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import MarkunreadMailboxRoundedIcon from "@mui/icons-material/MarkunreadMailboxRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import { useSummaryTokens } from "./tokens";
import FinancialBreakdown from "../FinancialBreakdown";
import { IGrantApplication } from "../../../grant-application/GrantApplicationTypes";
import { IGrantPayout } from "../GrantTypes";

/** One table at a time; the toggle flips between applications and payouts. */
const TableView: React.FC<{
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ applications, payouts, setIsModalOpen }) => {
  const T = useSummaryTokens();
  const [table, setTable] = useState<"applications" | "payouts">(
    "applications"
  );

  return (
    <Box>
      <ToggleButtonGroup
        exclusive
        value={table}
        onChange={(_, v) => v && setTable(v)}
        sx={{
          mb: 2,
          backgroundColor: T.panel,
          border: `1px solid ${T.line}`,
          borderRadius: "12px",
          "& .MuiToggleButton-root": {
            color: T.textLo,
            border: "none",
            px: 2.5,
            py: 0.75,
            gap: 0.75,
            textTransform: "none",
            fontSize: 13,
            "&.Mui-selected": {
              color: T.textHi,
              backgroundColor: T.panelSoft,
              boxShadow: `inset 0 -2px 0 ${T.water}`,
            },
            "&:hover": { backgroundColor: T.panelSoft },
          },
        }}
      >
        <ToggleButton value="applications">
          <MarkunreadMailboxRoundedIcon sx={{ fontSize: 16, mr: 0.75 }} />
          Applications ({applications.length})
        </ToggleButton>
        <ToggleButton value="payouts">
          <PaidRoundedIcon sx={{ fontSize: 16, mr: 0.75 }} />
          Payouts ({payouts.length})
        </ToggleButton>
      </ToggleButtonGroup>

      <FinancialBreakdown
        view={table}
        applications={applications}
        payouts={payouts}
        setIsModalOpen={setIsModalOpen}
      />
    </Box>
  );
};

export default TableView;
