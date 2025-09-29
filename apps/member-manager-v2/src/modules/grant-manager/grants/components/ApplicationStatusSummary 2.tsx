import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Divider,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResponsiveListItem from '../../../_components/ResponsiveListItem';
import { IGrantApplication } from '../../grant-application/GrantApplicationTypes';
import dayjs, { Dayjs } from 'dayjs';

interface ApplicationStatusSummaryProps {
    applications: IGrantApplication[];
    from: Dayjs | null;
    to: Dayjs | null;
}

const ApplicationStatusSummary: React.FC<ApplicationStatusSummaryProps> = ({
    applications,
    from,
    to,
}) => {

    const [notApprovedExpanded, setNotApprovedExpanded] = React.useState<
    true | false
  >(false);
  const [approvedExpanded, setApprovedExpanded] = React.useState<true | false>(
    false
  );

  const applicationsApproved = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Grant Agreement Signed/Sealed/Returned" ||
      application.status.name === "Paid in Full" ||
      application.status.name === "Revised per COR" ||
      application.status.name === "Authorized by DEQ" ||
      application.status.name === "Authorized by ORWA" ||
      application.status.name === "Committee Approved"
  ).length;
  const applicationsSigned = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Grant Agreement Signed/Sealed/Returned"
  ).length;
  const applicationsReviewed = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name !== "New Application"
  ).length;
  const applicationsNeedingReview = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "New Application"
  ).length;
  const applicationsNotApproved = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Not Approved"
  ).length;
  const applicationsWithdrawn = applications?.filter(
    (application: IGrantApplication) =>
      application.sub_status && application.sub_status.name === "Withdrawn"
  ).length;
  const applicationsOnHold = applications?.filter(
    (application: IGrantApplication) => application.status.name === "On Hold"
  ).length;
  const applicationsTabled = applications?.filter(
    (application: IGrantApplication) =>
      application.sub_status &&
      application.sub_status.name === "Tabled Application"
  ).length;
  const applicationRevised = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Revised per COR"
  ).length;
  const applicationsOverPopulationLimit = applications?.filter(
    (application: IGrantApplication) =>
      application.sub_status &&
      application.sub_status.name === "Denial: Over Population Limit"
  ).length;
  const applicationsChangeOrderRequest = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Change Order"
  ).length;
  const applicationsInsufficientGrantFunds = applications?.filter(
    (application: IGrantApplication) =>
      application.sub_status &&
      application.sub_status.name === "Denial: Insufficient"
  ).length;
  const applicationInelegible = applications?.filter(
    (application: IGrantApplication) =>
      application.sub_status && application.sub_status.name === "Inelegible"
  ).length;
  const paidInFull = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Paid in Full"
  ).length;
  const orwaApproved = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Authorized by ORWA"
  ).length;
  const deqApproved = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Authorized by DEQ"
  ).length;
  const committeeApproved = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Committee Approved"
  ).length;
  const awardLetterSent = applications?.filter(
    (application: IGrantApplication) =>
      application.status.name === "Award Letter Sent"
  ).length;

  const unableToApprove = applicationsNotApproved;
  const approvalRatio =
    (((applicationsApproved ?? 0) / (applicationsReviewed ?? 0)) * 100).toFixed(
      2
    ) + "%";

  return (
    <Card>
            <Typography variant="h6" fontWeight="bold" ml={2} textAlign="left">
              Application Status{" "}
              {from && to
                ? `(${dayjs(from).get("year") + "- " + dayjs(to).get("year")})`
                : "Totals"}
            </Typography>
            <Divider />
    <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <ResponsiveListItem label='Applications Received' value={`${applications?.length}`} divider />
              <ResponsiveListItem label='Applications Reviewed' value={`${applicationsReviewed}`} divider />
              <ResponsiveListItem label='Needing Review' value={`${applicationsNeedingReview}`} divider />
              <Accordion disableGutters square sx={{ boxShadow: 'none', position: 'relative', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', m: 0, p: 0 }} component="ul">
                <AccordionSummary sx={{
                  px: 0,
                  ' & > .MuiAccordionSummary-content': {
                    my: 0,
                    px: 0
                  },
                  ' & > .MuiAccordionSummary-expandIconWrapper': {
                    position: 'absolute',
                    left: 10
                  }
                }} onClick={() => approvedExpanded ? setApprovedExpanded(false) : setApprovedExpanded(true)} expandIcon={<ExpandMoreIcon />}>
                  <ResponsiveListItem label='Approved' value={`${applicationsApproved}`} sx={{ pl: 5 }} divider={approvedExpanded ? true : false} />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, mt: 1 }}>
                  <ResponsiveListItem label='Grant Signed/Sealed/Returned' value={`${applicationsSigned}`} sx={{ mt: -2 }} divider />
                  <ResponsiveListItem label='Paid in Full' value={`${paidInFull}`} divider />
                  <ResponsiveListItem label='Revised per COR' value={`${applicationRevised}`} divider/>
                  <ResponsiveListItem label='Authorized by DEQ' value={`${deqApproved}`} divider/>
                  <ResponsiveListItem label='Authorized by ORWA' value={`${orwaApproved}`} divider/>
                  <ResponsiveListItem label='Committee Approved' value={`${committeeApproved}`} divider/>
                  <ResponsiveListItem label='Award Letter Sent' value={`${awardLetterSent}`} divider/>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters square sx={{ boxShadow: 'none', position: 'relative', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', m: 0, p: 0 }} component="ul">
                <AccordionSummary sx={{
                  px: 0,
                  ' & > .MuiAccordionSummary-content': {
                    my: 0,
                    px: 0
                  },
                  ' & > .MuiAccordionSummary-expandIconWrapper': {
                    position: 'absolute',
                    left: 10
                  }
                }} onClick={() => notApprovedExpanded ? setNotApprovedExpanded(false) : setNotApprovedExpanded(true)} expandIcon={<ExpandMoreIcon />}>
                  <ResponsiveListItem label='Unable to Approve' value={`${unableToApprove}`} sx={{ pl: 5 }} divider={notApprovedExpanded ? true : false} />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, mt: 1 }}>
                  <ResponsiveListItem label='Withdrawn' value={`${applicationsWithdrawn}`} sx={{ mt: -2 }} divider />
                  <ResponsiveListItem label='On Hold' value={`${applicationsOnHold}`} divider />
                  <ResponsiveListItem label='Tabled' value={`${applicationsTabled}`} divider />
                  <ResponsiveListItem label='Over Population Limit' value={`${applicationsOverPopulationLimit}`} divider />
                  <ResponsiveListItem label='Change Order Request' value={`${applicationsChangeOrderRequest}`} divider />
                  <ResponsiveListItem label='Insufficient Grant Funds' value={`${applicationsInsufficientGrantFunds}`} divider />
                  <ResponsiveListItem label='Inelegible' value={`${applicationInelegible}`} />
                </AccordionDetails>
              </Accordion>
              <ResponsiveListItem label='Approval Ratio' value={`${approvalRatio}`} />
            </Box>
        </Card>    
  );
};

export default ApplicationStatusSummary;