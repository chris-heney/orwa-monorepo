import {
  Box,
  Button,
  Divider,
  Grid,
  ListItem,
  Modal,
  Typography,
} from "@mui/material";
import { RaRecord, useRecordContext } from "react-admin";
import ResponsiveListItem from "../../../_components/ResponsiveListItem";
import React from "react";
import { formatNumber } from "../../../../helpers/Formators";
import ApplicationPayoutList from "../ApplicationPayoutList";
import {
  IGrantApplication,
  IProjectType,
  StrapiFile,
} from "../GrantApplicationTypes";
import { GenerateAwardLetter } from "./GenerateAwardLetter";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../helpers/dateFormatter";
import GrantStatus from "./GrantStatus";
import ApplicationEmailModal from "./ApplicationEmailModal";
import AssetModal, { AssetModalFile } from "../../../_components/AssetModal";
import StarIcon from '@mui/icons-material/Star';

const statusesForAwardLetter = [
  "Authorized by DEQ",
  "Grant Agreement Signed/Sealed/Returned",
  "Paid in Full",
  "Award Letter Sent",
  "Revised per COR",
];

const statusesForApplicationPayoutList = [
  "Grant Agreement Signed/Sealed/Returned",
  "Revised per COR",
  "Paid in Full",
];

export const displayLinks = (links: string) => {
  if (!links) return null;

  const linkList = links.split(",").map((link) => link.trim());

  const linkElements = linkList.map((link, index) => (
    <li
      key={index}
      style={{
        wordWrap: "break-word", // Ensures long URLs wrap correctly
        overflowWrap: "break-word", // Cross-browser compatibility
        whiteSpace: "normal", // Allows text to wrap
        marginBottom: "4px", // Spacing between links
      }}
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#1a73e8", // Link color
          textDecoration: "underline",
          wordBreak: "break-all", // Break long strings
        }}
      >
        {link}
      </a>
    </li>
  ));

  return <ul style={{ paddingLeft: "16px" }}>{linkElements}</ul>;
};

// Display Strapi stored files in a list; clicking opens an in-app preview
// modal (AssetModal) instead of navigating away.
export const FileLinkList = ({ files }: { files: StrapiFile | StrapiFile[] }) => {
  const [previewFile, setPreviewFile] = React.useState<AssetModalFile | null>(null);

  if (!files) return null;

  // Ensure files is always an array
  const fileArray = Array.isArray(files) ? files : [files];

  return (
    <>
      <ul style={{ paddingLeft: "16px" }}>
        {fileArray.map((file: any, index: number) => (
          <li
            key={index}
            style={{
              wordWrap: "break-word", // Ensures long URLs break onto a new line
              overflowWrap: "break-word", // Cross-browser compatibility
              whiteSpace: "normal", // Allow multi-line
              marginBottom: "4px", // Adds some spacing between links
            }}
          >
            <a
              href={`${import.meta.env.VITE_API_ENDPOINT}${file.url}`}
              onClick={(e) => {
                e.preventDefault();
                setPreviewFile({ url: file.url, name: file.name, mime: file.mime });
              }}
              style={{
                color: "#1a73e8", // Consistent link color
                textDecoration: "underline",
                wordBreak: "break-all", // Breaks long words
                cursor: "pointer",
              }}
            >
              {file.name || file.url}
            </a>
          </li>
        ))}
      </ul>
      <AssetModal
        open={previewFile !== null}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </>
  );
};

// Backward-compatible helper form used throughout this file
export const displayFileLinks = (files: StrapiFile | StrapiFile[]) => (
  <FileLinkList files={files} />
);

const GrantApplicationDetails = () => {
  const record = useRecordContext<IGrantApplication>();

  const [allStatuses, setAllStatuses] = React.useState<boolean>(false);

    const [applicationStatus, setApplicationStatus] =
      React.useState<RaRecord | null>(null);
    const [selectedApplication, setSelectedApplication] =
      React.useState<RaRecord | null>(null);
       const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);

  if (!record) return null;

  // add up all payouts and subtract from award amount
  const totalGrantPayouts = record.payouts?.reduce((acc, payout) => {
    acc += payout.amount;
    return acc;
  }, 0);

  const remainingGrantFunds = record.award_amount - totalGrantPayouts;

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Status Name with Background */}
        <GrantStatus
          setSelectedApplication={setSelectedApplication}
          setApplicationStatus={setApplicationStatus}
          setIsEmailModalOpen={setIsEmailModalOpen}
          setIsModalOpen={setIsEmailModalOpen}
          applicationStatus={applicationStatus}
          fullWidth
          allStatuses={allStatuses}
        />
        {/* <Box
          sx={{
            backgroundColor: record.status.color, // Only this section gets the color
            borderRadius: "8px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#fff", // Text color for better contrast
              fontWeight: "bold",
            }}
          >
            {record.status.name}
          </Typography>
        </Box> */}

        {/* Action Buttons */}
        <Box display="flex" gap={1}>
          {/* View Applicant PDF Button */}
          {record?.applicant_pdf && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_API_ENDPOINT}${
                    record.applicant_pdf.url
                  }`,
                  "_blank"
                );
              }}
            >
              View Applicant PDF
            </Button>
          )}

          {/* Generate Award Letter Button */}
          {statusesForAwardLetter.includes(
            record?.status?.name?.replace(" PFY", "")
          ) && <GenerateAwardLetter application={record} />}
        </Box>
      </Box>
      <Grid container spacing={2}>
        {/* system information and contacts */}
        {/* make sure info isnt null */}

        {statusesForApplicationPayoutList.includes(
          record?.status?.name?.replace(" PFY", "")
        ) && (
          <Grid item xs={12} sm={12} md={12}>
            <ApplicationPayoutList />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            <StarIcon sx={{ color: "gold" }} onClick={() => {
              setAllStatuses((prev) => !prev);
            }} />
            <div>
            System Information
            </div>
          </Typography>
          <Divider />
          {record.application_id && (
            <ResponsiveListItem
              label="Application ID"
              value={"#" + record.application_id}
              divider
            />
          )}
          {record.previous_application_id && (
            <ResponsiveListItem
              label="Previous Application ID"
              value={"#" + record.previous_application_id}
              divider
            />
          )}
          {record.facility_id && (
            <ResponsiveListItem
              label="Facility ID"
              value={record.facility_id}
              divider
            />
          )}
          {record.population_served && (
            <ResponsiveListItem
              label="Population Served"
              value={`${record.population_served}`}
              divider
            />
          )}
          {record.county && (
            <ResponsiveListItem label="County" value={record.county} divider />
          )}
          {record.committee_date && (
            <ResponsiveListItem
              label="Committee Date"
              value={formatDate(record.committee_date)}
              divider
            />
          )}
          {record.application_date && (
            <ResponsiveListItem
              label="Application Date"
              value={formatDate(record.application_date)}
              divider
            />
          )}
        </Grid>

        {/* address information */}
        {/* make sure info is not null */}
        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Address Information
          </Typography>
          <Divider />
          {record.physical_address_street && (
            <ResponsiveListItem
              label="Physical Address"
              value={`${record.physical_address_street}`}
              divider
            />
          )}
          {record.physical_address_line_two && (
            <ResponsiveListItem
              label="Physical Address Line 2"
              value={`${record.physical_address_line_two}`}
              divider
            />
          )}
          {record.physical_address_city && (
            <ResponsiveListItem
              label="Physical Address City"
              value={`${record.physical_address_city}`}
              divider
            />
          )}
          {record.physical_address_state && (
            <ResponsiveListItem
              label="Physical Address State"
              value={`${record.physical_address_state}`}
              divider
            />
          )}
          {record.physical_address_zip && (
            <ResponsiveListItem
              label="Physical Address Zip"
              value={`${record.physical_address_zip}`}
              divider
            />
          )}
          {record.mailing_address_street && (
            <ResponsiveListItem
              label="Mailing Address"
              value={`${record.mailing_address_street}`}
              divider
            />
          )}
          {record.mailing_address_line_two && (
            <ResponsiveListItem
              label="Mailing Address Line 2"
              value={`${record.mailing_address_line_two}`}
              divider
            />
          )}
          {record.mailing_address_city && (
            <ResponsiveListItem
              label="Mailing Address City"
              value={`${record.mailing_address_city}`}
              divider
            />
          )}
          {record.mailing_address_state && (
            <ResponsiveListItem
              label="Mailing Address State"
              value={`${record.mailing_address_state}`}
              divider
            />
          )}
          {record.mailing_address_zip && (
            <ResponsiveListItem
              label="Mailing Address Zip"
              value={`${record.mailing_address_zip}`}
              divider
            />
          )}
        </Grid>

        {/* Financials */}
        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Financials
          </Typography>
          <Divider />
          {record.combined_cost_of_projects !== undefined && (
            <ResponsiveListItem
              label="Combined Cost of Projects"
              value={`${formatNumber(
                parseInt(record.combined_cost_of_projects)
              )}`}
              divider
            />
          )}
          {record.requested_grant_amount !== undefined && (
            <ResponsiveListItem
              label="Requested Grant Amount"
              value={`${formatNumber(parseInt(record.requested_grant_amount))}`}
              divider
            />
          )}
          {record.approved_project_cost !== undefined && (
            <ResponsiveListItem
              label="Approved Project Cost"
              value={`${formatNumber(record.approved_project_cost)}`}
              divider
            />
          )}
          {record.award_amount !== undefined && (
            <ResponsiveListItem
              label="Award Amount"
              value={`${formatNumber(record.award_amount)}`}
              divider
            />
          )}
          {record.expected_utility_match !== undefined && (
            <ResponsiveListItem
              label="Expected Utility Match"
              value={`${formatNumber(record.expected_utility_match)}`}
              divider
            />
          )}
          {record.payouts && (
            <ResponsiveListItem
              label="Remaining Grant Funds"
              value={`${formatNumber(remainingGrantFunds)}`}
              divider
            />
          )}
          {record.minimum_utility_financial_contribution !== undefined && (
            <ResponsiveListItem
              label="Minimum Utility Financial Contribution"
              value={`${formatNumber(
                parseInt(record.minimum_utility_financial_contribution)
              )}`}
              divider
            />
          )}
          {record.portion_matched_by_recipient !== undefined && (
            <ResponsiveListItem
              label="Portion Matched by Recipient"
              value={`${formatNumber(
                parseInt(record.portion_matched_by_recipient)
              )}`}
              divider
            />
          )}
        </Grid>
        {/* Contacts */}
        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Contacts
          </Typography>
          <Divider />
          {/* make this link to contact/point_of_contact.id */}
          {record.point_of_contact && (
            <ResponsiveListItem
              label="Point of Contact"
              value={
                <Link to={`/contacts/${record.point_of_contact.id}`}>
                  {record.point_of_contact.first +
                    " " +
                    record.point_of_contact.last}
                </Link>
              }
              divider
            />
          )}
          {record.chairman && (
            <ResponsiveListItem
              label="Chairman"
              value={
                <Link to={`/contacts/${record.chairman.id}`}>
                  {record.chairman.first + " " + record.chairman.last}
                </Link>
              }
              divider
            />
          )}
          {record.signatory_name && (
            <ResponsiveListItem
              label="Signatory Name"
              value={record.signatory_name}
              divider
            />
          )}
          {record.signatory_title && (
            <ResponsiveListItem
              label="Signatory Title"
              value={record.signatory_title}
              divider
            />
          )}
          {record.engineer && (
            <ResponsiveListItem
              label="Engineer Name"
              value={
                <Link to={`/contacts/${record.engineer.id}`}>
                  {record.engineer.first + " " + record.engineer.last}
                </Link>
              }
              divider
            />
          )}
          {record.additional_contacts?.length > 0 && (
            <ResponsiveListItem
              label="Additional Contacts"
              value={
                <Box component="span" sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {record.additional_contacts.map((contact: RaRecord) => (
                    <Link key={contact.id} to={`/contacts/${contact.id}`}>
                      {contact.first + " " + contact.last}
                    </Link>
                  ))}
                </Box>
              }
              divider
            />
          )}
        </Grid>

        {/* Files and Information */}
        {/* hidden if status is approved */}
        <Grid item xs={12} sm={6} md={12}>
          {/* put each in their own item sx 6 */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Proposals and Information
          </Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={6}>
              {record.drinking_or_wastewater && (
                <ResponsiveListItem
                  label="Drinking or Wastewater"
                  value={record.drinking_or_wastewater}
                  divider
                />
              )}
              <ResponsiveListItem
                label="Projects Selected"
                value={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {record.selected_projects?.map(
                      (project: IProjectType, index: number) => (
                        <li key={index}>{project.name}</li>
                      )
                    )}
                  </div>
                }
                divider
              />
              <ResponsiveListItem
                label="Projects Approved"
                value={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {record.approved_projects?.map(
                      (project: IProjectType, index: number) => (
                        <li key={index}>{project.name}</li>
                      )
                    )}
                  </div>
                }
                divider
              />
              {/* {record.approved_projects && <ResponsiveListItem label='Projects Approved' value={record.approved_projects} divider />} */}
              {record.change_order_request && (
                <ResponsiveListItem
                  label="Change Order Request"
                  value={record.change_order_request}
                />
              )}
            </Grid>

            {record.additional_information && (
              <Grid item xs={12} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Additional Information{" "}
                </ListItem>
                <Divider />
                <Typography ml={2}>{record.additional_information}</Typography>
              </Grid>
            )}

            {/* Project Description */}
            {record.description_justification_estimated_cost && (
              <Grid item xs={6} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Project Description{" "}
                </ListItem>
                <Divider />
                <Typography ml={2}>
                  {record.description_justification_estimated_cost}
                </Typography>
              </Grid>
            )}
            {record.other_needs && (
              <Grid item xs={6} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Other Needs{" "}
                </ListItem>
                <Divider />
                <Typography ml={2}>{record.other_needs}</Typography>
              </Grid>
            )}
            {/* Other Description */}
            {record.other_describe && (
              <Grid item xs={6} sm={6} md={6}>
                <ResponsiveListItem
                  label="Other Description"
                  value={record.other_describe}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        {/* Engineer info/report/files */}
        {/* hidden if status is approved */}
        <Grid item xs={12} sm={6} md={12}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Engineer Information
          </Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={6}>
              {record.report_approved_by_deq && (
                <ResponsiveListItem
                  label="Report Approved by DEQ"
                  value={record.report_approved_by_deq}
                  divider
                />
              )}
              {record.resolves_violation && (
                <ResponsiveListItem
                  label="Resolves Violation"
                  value={record.resolves_violation}
                  divider
                />
              )}
            </Grid>

            {record.upload_engineering_report ||
            record.uploaded_engineering_report ? (
              <Grid item xs={12} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Engineering Report{" "}
                </ListItem>
                <Divider />
                {record.upload_engineering_report &&
                  displayLinks(record.upload_engineering_report)}
                {record.uploaded_engineering_report &&
                  displayFileLinks(record.uploaded_engineering_report)}
              </Grid>
            ) : null}

            {/* project proposal birds is a file */}
            {(record.project_proposal_birds || record.proposals) && (
              <Grid item xs={12} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Project Proposal Bids
                </ListItem>
                <Divider />
                {record.project_proposal_birds &&
                  displayLinks(record.project_proposal_birds)}
                {record.proposals && displayFileLinks(record.proposals)}
                {/* {record.applicant_pdf && fetchFileLinks([record.applicant_pdf])} */}
              </Grid>
            )}

            {/* Consent Order */}

            {record.uploaded_additional_files || record.additional_files ? (
              <Grid item xs={12} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Additional Files{" "}
                </ListItem>
                <Divider />
                {record.additional_files &&
                  displayLinks(record.additional_files)}
                {record.uploaded_additional_files &&
                  displayFileLinks(record.uploaded_additional_files)}
              </Grid>
            ) : null}

            {/* consent_order_number long string and consent_order <- file */}

            {record.consent_order && (
              <Grid item xs={12} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Consent Order #{record.consent_order_number}
                </ListItem>
                <Divider />
                {record.consent_order && displayFileLinks(record.consent_order)}
              </Grid>
            )}

            {record.notice_of_violation ||
            record.uploaded_notice_of_violation ? (
              <Grid item xs={12} sm={6} md={6}>
                <ListItem
                  sx={{
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                >
                  Notice of Violation{" "}
                </ListItem>
                <Divider />
                {record.notice_of_violation &&
                  displayLinks(record.notice_of_violation)}
                {record.uploaded_notice_of_violation &&
                  displayFileLinks(record.uploaded_notice_of_violation)}
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <>
          <ApplicationEmailModal
            setIsEmailModalOpen={setIsEmailModalOpen}
            selectedApplication={selectedApplication}
            applicationStatus={applicationStatus}
          />
        </>
      </Modal>
    </Box>
  );
};

export default GrantApplicationDetails;
