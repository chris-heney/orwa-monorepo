import { Box, Divider, Typography } from "@mui/material";
import ResponsiveListItem from "./components/ResponsiveListItem";
import { formatNumber } from "./helpers/formatNumbers";
import { useContext } from "react";
import { DirectoryContext } from "./helpers/AppContextProvider";
import DisplayStrapiFiles from "./components/DisplayStrapiFiles";
import DisplayStringLinks from "./components/DisplayStringLinks";

const ApplicationInformation = () => {
  const { applications, applicationIndex } = useContext(DirectoryContext);

  return !applications ? (
    <>No Application in Queue</>
  ) : (
    <Box>
      <Typography variant="h5" className="mb-4" textAlign={"left"} mb={3}>
        Applicant Information
      </Typography>

      <Typography variant="body1" fontWeight="bold" textAlign="left">
        Facility
      </Typography>
      <Divider />
      <ResponsiveListItem
        label="Facility ID"
        value={applications[applicationIndex]?.facility_id}
        divider
      />
      <ResponsiveListItem
        label="Population Served"
        value={`${applications[applicationIndex]?.population_served}` || "0"}
        divider
      />
      <ResponsiveListItem
        label="County"
        value={applications[applicationIndex]?.county}
        divider
      />
      <ResponsiveListItem
        label="Physical Address"
        value={`${applications[applicationIndex]?.physical_address_street}, ${applications[applicationIndex]?.physical_address_city}, ${applications[applicationIndex]?.physical_address_state} ${applications[applicationIndex]?.physical_address_zip}`}
        divider
      />

      <Typography variant="body1" fontWeight="bold" textAlign="left">
        Financials
      </Typography>
      <Divider />
      <ResponsiveListItem
        label="Combined Cost of Projects"
        value={formatNumber(
          parseInt(
            applications[applicationIndex]?.combined_cost_of_projects
              ? applications[
                  applicationIndex
                ]?.combined_cost_of_projects.toString()
              : "0"
          )
        )}
        divider
      />
      <ResponsiveListItem
        label="Requested Grant Amount"
        value={formatNumber(
          parseInt(
            applications[applicationIndex]?.requested_grant_amount
              ? applications[
                  applicationIndex
                ]?.requested_grant_amount.toString()
              : "0"
          )
        )}
        divider
      />
      {applications[applicationIndex]?.portion_matched_by_recipient && (
        <ResponsiveListItem
          label="Minimum Utility Financial Contribution"
          value={formatNumber(
            parseInt(
              applications[
                applicationIndex
              ]?.portion_matched_by_recipient.toString() || "0"
            )
          )}
          divider
        />
      )}

      {applications[applicationIndex]
        ?.minimum_utility_financial_contribution && (
        <ResponsiveListItem
          label="Minimum Utility Financial Contribution"
          value={formatNumber(
            parseInt(
              applications[
                applicationIndex
              ]?.minimum_utility_financial_contribution.toString() || "0"
            )
          )}
          divider
        />
      )}
      <ResponsiveListItem
        label="Expected Utility Match"
        value={formatNumber(
          applications[applicationIndex]?.expected_utility_match ?? 0
        )}
        divider
      />

      <ResponsiveListItem
        label="Drinking Water or Wastewater"
        value={applications[applicationIndex]?.drinking_or_wastewater}
        divider
      />

      {/* Specific Drinking Water or Wastewater Projects */}
      {applications[applicationIndex]?.drinking_water_projects_selected && (
        <ResponsiveListItem
          label="Drinking Water Projects Selected"
          value={
            applications[applicationIndex]?.drinking_water_projects_selected
          }
          divider
        />
      )}
      {applications[applicationIndex]?.wastewater_projects_selected && (
        <ResponsiveListItem
          label="Wastewater Projects Selected"
          value={applications[applicationIndex]?.wastewater_projects_selected}
          divider
        />
      )}

      {/* Project Select */}
      <ResponsiveListItem
        label="Projects Selected"
        divider
        value={
          <Box
            component={"ul"}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {applications[applicationIndex]?.selected_projects.data.map(
              (project, index) => (
                <Typography sx={{ textAlign: "right" }} key={index}>
                  {project.name}
                </Typography>
              )
            )}
          </Box>
        }
      />

      <ResponsiveListItem
        label="Projects Approved"
        divider
        value={
          <Box
            component={"ul"}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {applications[applicationIndex]?.approved_projects.data.map(
              (project, index) => (
                <Typography sx={{ textAlign: "right" }} key={index}>
                  {project.name}
                </Typography>
              )
            )}
          </Box>
        }
      />

      {/* Violation Resolution */}
      <ResponsiveListItem
        label="Resolves Violation"
        value={applications[applicationIndex]?.resolves_violation}
        divider
      />

      {/* Financial Additional Information */}

      <ResponsiveListItem
        label="Approved Project Cost"
        value={formatNumber(
          applications[applicationIndex]?.approved_project_cost ?? 0
        )}
        divider
      />
      <ResponsiveListItem
        label="Award Amount"
        value={formatNumber(applications[applicationIndex]?.award_amount ?? 0)}
        divider
      />
      <ResponsiveListItem
        label="Change Order Request"
        value={applications[applicationIndex]?.change_order_request}
        divider
      />

      {/* Satisfaction of DEQ Issued Order */}
      <ResponsiveListItem
        label="Satisfy DEQ Issued Order"
        value={
          applications[applicationIndex]?.satisfy_deq_issued_order
            ? "Yes"
            : "No"
        }
        divider
      />

      {/* Consent Order */}
      <ResponsiveListItem
        label="Consent Order Number"
        value={applications[applicationIndex]?.consent_order_number}
        divider
      />
      {applications[applicationIndex]?.consent_order.data && (
        <DisplayStrapiFiles
          strapiFiles={applications[applicationIndex]?.consent_order}
          title="Consent Order"
        />
      )}

      {/* Money Set Aside and Loans */}
      <ResponsiveListItem
        label="Money Set Aside"
        value={applications[applicationIndex]?.money_set_aside ? "Yes" : "No"}
        divider
      />
      <ResponsiveListItem
        label="Applied to Other Loans"
        value={
          applications[applicationIndex]?.applied_to_other_loans ? "Yes" : "No"
        }
        divider
      />

      {/* Additional Information */}
      {applications[applicationIndex]?.additional_information && (
        <Box>
          <Typography variant="body1" fontWeight="bold" textAlign="left">
            Additional Information
          </Typography>
          <Divider />
          <ResponsiveListItem
            label=""
            sx={{ textAlign: "left" }}
            value={applications[applicationIndex]?.additional_information}
            divider
          />
        </Box>
      )}

      {/* LRSP Plan */}
      <ResponsiveListItem
        label="LRSP Plan"
        value={applications[applicationIndex]?.lrsp_plan ? "Yes" : "No"}
        divider
      />
      <ResponsiveListItem
        label="More Information about LRSP"
        value={applications[applicationIndex]?.more_info_lrsp ? "Yes" : "No"}
        divider
      />

      {/* Project Justification */}
      {applications[applicationIndex]
        ?.description_justification_estimated_cost && (
        <Box>
          <Typography variant="body1" fontWeight="bold" textAlign="left">
            Project Justification
          </Typography>
          <Divider />
          <ResponsiveListItem
            label=""
            sx={{ textAlign: "left" }}
            value={
              applications[applicationIndex]
                ?.description_justification_estimated_cost
            }
            divider
          />
        </Box>
      )}

      {/* Other Needs */}
      {applications[applicationIndex]?.other_needs && (
        <Box>
          <Typography variant="body1" fontWeight="bold" textAlign="left">
            Other Needs
          </Typography>
          <Divider />
          <ResponsiveListItem
            label=""
            sx={{ textAlign: "left" }}
            value={applications[applicationIndex]?.other_needs}
            divider
          />
        </Box>
      )}

      {applications[applicationIndex]?.other_describe && (
        <Box>
          <Typography variant="body1" fontWeight="bold" textAlign="left">
            Other Descriptions
          </Typography>
          <Divider />
          <ResponsiveListItem
            label=""
            sx={{ textAlign: "left" }}
            value={applications[applicationIndex]?.other_describe}
            divider
          />
        </Box>
      )}

      {/* Project Proposal Bids */}
      {applications[applicationIndex]?.project_proposal_birds && (
        <DisplayStringLinks
          links={applications[applicationIndex]?.project_proposal_birds}
          title="Project Proposal Bids"
        />
      )}
      {applications[applicationIndex]?.proposals.data && (
        <DisplayStrapiFiles
          strapiFiles={applications[applicationIndex]?.proposals}
          title="Project Proposal Bids"
        />
      )}

      {/* Additional Files */}
      {applications[applicationIndex]?.additional_files && (
        <DisplayStringLinks
          links={applications[applicationIndex]?.additional_files}
          title="Additional Files"
        />
      )}
      {applications[applicationIndex]?.uploaded_additional_files.data && (
        <DisplayStrapiFiles
          strapiFiles={
            applications[applicationIndex]?.uploaded_additional_files
          }
          title="Additional Files"
        />
      )}

      {/* Engineer */}
      {applications[applicationIndex]?.has_engineer && (
        <Box>
          {applications[applicationIndex]?.engineer.data && (
            <ResponsiveListItem
              label="Engineer"
              value={`${applications[applicationIndex]?.engineer.data.first} ${applications[applicationIndex]?.engineer.data.last}`}
              divider
            />
          )}
          {applications[applicationIndex]?.engineer.data && (
            <ResponsiveListItem
              label="Engineer Email"
              value={
                applications[applicationIndex]?.engineer.data.email
              }
              divider
            />
          )}
          {applications[applicationIndex]?.engineer.data && (
            <ResponsiveListItem
              label="Engineer Phone"
              value={
                applications[applicationIndex]?.engineer.data.phone
              }
              divider
            />
          )}
          <ResponsiveListItem
            label="Engineering Report"
            sx={{ textAlign: "left" }}
            value={applications[applicationIndex]?.engineering_report}
            divider
          />
          {applications[applicationIndex]?.upload_engineering_report && (
            <DisplayStringLinks
              links={applications[applicationIndex]?.upload_engineering_report}
              title="Engineering Report"
            />
          )}
          {applications[applicationIndex]?.uploaded_engineering_report.data && (
            <DisplayStrapiFiles
              strapiFiles={
                applications[applicationIndex]?.uploaded_engineering_report
              }
              title="Engineering Report"
            />
          )}
        </Box>
      )}

      {/* Notice Of Violation */}
      {applications[applicationIndex]?.notice_of_violation && (
        <DisplayStringLinks
          links={applications[applicationIndex]?.notice_of_violation}
          title="Notice of Violation"
        />
      )}
      {applications[applicationIndex]?.uploaded_notice_of_violation.data && (
        <DisplayStrapiFiles
          strapiFiles={
            applications[applicationIndex]?.uploaded_notice_of_violation
          }
          title="Notice of Violation"
        />
      )}
    </Box>
  );
};

export default ApplicationInformation;
