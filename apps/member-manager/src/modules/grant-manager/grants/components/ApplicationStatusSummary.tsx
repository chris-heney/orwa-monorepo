import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Divider,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ResponsiveListItem from "../../../_components/ResponsiveListItem";
import { IGrantApplication } from "../../grant-application/GrantApplicationTypes";
import { Dayjs } from "dayjs";
import { useSummaryTokens } from "./summary/tokens";

interface ApplicationStatusSummaryProps {
  applications: IGrantApplication[];
  from: Dayjs | null;
  to: Dayjs | null;
}

const STATUS_GROUPS = {
  approved: [
    "Grant Agreement Signed/Sealed/Returned",
    "Paid in Full",
    "Revised per COR",
    "Authorized by DEQ",
    "Authorized by ORWA",
    "Committee Approved",
    "Award Letter Sent",
  ],
  unapproved: [
    "Not Approved",
    "Withdrawn",
    "On Hold",
    "Tabled Application",
    "Denial: Over Population Limit",
    "Denial: Insufficient",
    "Inelegible",
  ],
  changeOrer: ["Change Order"],
};

const ApplicationStatusSummary: React.FC<ApplicationStatusSummaryProps> = ({
  applications,
  from,
  to,
}) => {
  const T = useSummaryTokens();
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);

  const {
    applicationsApproved,
    applicationsReviewed,
    applicationsNeedingReview,
    unapprovedApplications,
    statusCounts,
    changeOrders,
  } = useMemo(() => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status.name] = (acc[app.status.name] || 0) + 1;
      if (app.sub_status?.name) {
        acc[app.sub_status.name] = (acc[app.sub_status.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      applicationsApproved: STATUS_GROUPS.approved.reduce(
        (sum, status) => sum + (statusCounts[status] || 0),
        0
      ),
      applicationsSigned:
        statusCounts["Grant Agreement Signed/Sealed/Returned"] || 0,
      applicationsReviewed:
        applications.length - (statusCounts["New Application"] || 0),
      applicationsNeedingReview: statusCounts["New Application"] || 0,
      unapprovedApplications: STATUS_GROUPS.unapproved.reduce(
        (sum, status) => sum + (statusCounts[status] || 0),
        0
      ),
      changeOrders: statusCounts["Change Order"] || 0,
      statusCounts,
    };
  }, [applications]);

  // Approval ratio calculation with zero division protection
  const approvalRatio = useMemo(() => {
    if (applicationsReviewed === 0) return "0.00%";
    return (
      ((applicationsApproved / applicationsReviewed) * 100).toFixed(2) + "%"
    );
  }, [applicationsApproved, applicationsReviewed]);

  const handlePanelChange = (panel: string) =>
    setExpandedPanel(expandedPanel === panel ? false : panel);

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: T.panel,
        color: T.textHi,
        border: `1px solid ${T.line}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" fontWeight="bold" p={2}>
        Applications {from && to ? `(${from.year()} - ${to.year()})` : "Totals"}
      </Typography>

      <Divider sx={{ bgcolor: T.line }} />

      <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
        <ResponsiveListItem
          label="Applications Received"
          value={applications.length.toString()}
          divider
        />
        <ResponsiveListItem
          label="Applications Reviewed"
          value={applicationsReviewed.toString()}
          divider
        />
        <ResponsiveListItem
          label="Needing Review"
          value={applicationsNeedingReview.toString()}
          divider
        />

        {/* Approved Applications Accordion */}
        <Accordion
          disableGutters
          expanded={expandedPanel === "approved"}
          onChange={() => handlePanelChange("approved")}
          sx={{ bgcolor: "transparent" }}
        >
          <AccordionSummary
            sx={{
              backgroundColor: T.panelSoft,
              color: T.textHi,
              px: 0,
              " & > .MuiAccordionSummary-content": {
                my: 0,
                px: 0,
              },
              " & > .MuiAccordionSummary-expandIconWrapper": {
                position: "absolute",
                left: 10,
              },
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: T.textLo }} />}
          >
            {" "}
            <ResponsiveListItem
              label="Approved"
              value={applicationsApproved.toString()}
              sx={{ pl: 5 }}
              divider={expandedPanel === "approved"}
            />
          </AccordionSummary>
          <AccordionDetails
            sx={{ p: 0, mt: 1, backgroundColor: T.panelSoft, color: T.textHi }}
          >
            {STATUS_GROUPS.approved.map((status) => (
              <ResponsiveListItem
                key={status}
                label={status}
                value={(statusCounts[status] || 0).toString()}
                divider
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Unapproved Applications Accordion */}
        <Accordion
          disableGutters
          expanded={expandedPanel === "unapproved"}
          onChange={() => handlePanelChange("unapproved")}
          sx={{ bgcolor: "transparent" }}
        >
          <AccordionSummary
            sx={{
              backgroundColor: T.panelSoft,
              color: T.textHi,
              px: 0,
              " & > .MuiAccordionSummary-content": {
                my: 0,
                px: 0,
              },
              " & > .MuiAccordionSummary-expandIconWrapper": {
                position: "absolute",
                left: 10,
              },
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: T.textLo }} />}
          >
            <ResponsiveListItem
              label="Unable to Approve"
              value={unapprovedApplications.toString()}
              sx={{ pl: 5 }}
              divider={expandedPanel === "unapproved"}
            />
          </AccordionSummary>
          <AccordionDetails
            sx={{ p: 0, mt: 1, backgroundColor: T.panelSoft, color: T.textHi }}
          >
            {STATUS_GROUPS.unapproved.map((status) => (
              <ResponsiveListItem
                key={status}
                label={status.replace("Denial: ", "")}
                value={(statusCounts[status] || 0).toString()}
                divider
              />
            ))}
          </AccordionDetails>
        </Accordion>

        <ResponsiveListItem
          label="Change Orders"
          value={changeOrders.toString()}
          divider
        />

        <ResponsiveListItem
          label="Approval Ratio"
          value={approvalRatio}
          sx={{ fontWeight: "bold" }}
        />
      </Box>
    </Card>
  );
};

export default ApplicationStatusSummary;
