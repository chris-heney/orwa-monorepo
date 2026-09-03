import React from "react";
import {
  BooleanField,
  DateField,
  FunctionField,
  List,
  TextField,
  useStore,
} from "react-admin";
import { Box } from "@mui/material";
import AgDatagrid from "../../_components/AgDatagrid";
import type { AgDatagridPrefs } from "../../_components/AgDatagrid";
import CustomPagination from "../../_components/CustomPagination";
import {
  EDUCATION_LABELS,
  RELATIONSHIP_LABELS,
  formatAddress,
  formatPersonName,
} from "../../_components/review-packet";
import { useOrwefContext } from "../OrwefContextProvider";
import { listFinancialResources } from "../helpers/financialResources";
import {
  buildScholarshipListFilter,
  watersystemRegion,
} from "../helpers/listFilters";
import { SCHOLARSHIP_LIST_OMIT } from "../helpers/scholarshipListColumns";
import { SCHOLARSHIP_SELECTED_IDS_KEY } from "./ScholarshipPrintButton";
import MediaLink from "./MediaLink";

const AG_PREFS_KEY = "agGrid.scholarship-applications";

const mediaCell =
  (source: string, label: string) =>
  (record: Record<string, unknown>) => (
    <MediaLink file={record[source]} label={label} variant="cell" />
  );

const ScholarshipApplicationList = () => {
  const { search, year, region } = useOrwefContext();
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});
  const listPerPage = agPrefs.pageSize || 50;

  return (
    <Box sx={{ width: 1, minWidth: 0 }}>
      <List
        resource="scholarship-applications"
        title=" "
        actions={false}
        disableSyncWithLocation
        filter={buildScholarshipListFilter(search, year, region)}
        sort={{ field: "submission_date", order: "DESC" }}
        perPage={listPerPage}
        pagination={<CustomPagination />}
        queryOptions={{
          meta: { populate: "*", raw: true },
        }}
        sx={{
          "& .RaList-main": { marginTop: 0 },
          "& .RaList-content": { boxShadow: "none" },
          ".RaList-actions": { p: 0, minHeight: 0 },
        }}
      >
        <AgDatagrid
          preferenceKey={AG_PREFS_KEY}
          rowClick="show"
          rowSelection
          selectionStoreKey={SCHOLARSHIP_SELECTED_IDS_KEY}
          omit={SCHOLARSHIP_LIST_OMIT}
        >
          <FunctionField
            label="Applicant"
            sortBy="applicant_last_name"
            render={(record: {
              applicant_first_name?: string;
              applicant_last_name?: string;
            }) =>
              `${record.applicant_first_name || ""} ${
                record.applicant_last_name || ""
              }`.trim()
            }
          />
          <TextField source="applicant_email" label="Email" />
          <TextField source="applicant_phone" label="Phone" />
          <TextField source="system_name" label="Water System" />
          <FunctionField
            label="Region"
            source="watersystem.region"
            sortable={false}
            render={(record: {
              watersystem?: { region?: string | null } | null;
            }) => watersystemRegion(record) || "—"}
          />
          <TextField source="gpa" label="GPA" />
          <TextField source="application_status" label="Status" />
          <DateField source="submission_date" label="Submitted" />

          <TextField source="applicant_first_name" label="First name" />
          <TextField source="applicant_middle_name" label="Middle name" />
          <TextField source="applicant_last_name" label="Last name" />
          <TextField source="applicant_street" label="Street" />
          <TextField source="applicant_city" label="City" />
          <TextField source="applicant_state" label="State" />
          <TextField source="applicant_zip" label="ZIP" />
          <FunctionField
            source="relationship"
            label="Relationship"
            render={(record: { relationship?: string }) =>
              record.relationship
                ? RELATIONSHIP_LABELS[record.relationship] ||
                  record.relationship
                : ""
            }
          />
          <FunctionField
            source="eligible_participant_name"
            label="Eligible participant"
            sortable={false}
            render={(record: {
              eligible_participant_name?: {
                first?: string | null;
                last?: string | null;
              } | null;
            }) => {
              const name = formatPersonName(record.eligible_participant_name);
              return name === "—" ? "" : name;
            }}
          />
          <TextField
            source="eligible_participant_title"
            label="Participant title"
          />
          <TextField
            source="eligible_participant_email"
            label="Participant email"
          />
          <TextField
            source="eligible_participant_phone"
            label="Participant phone"
          />
          <FunctionField
            source="eligible_participant_address"
            label="Participant address"
            sortable={false}
            render={(record: {
              eligible_participant_address?: {
                street?: string | null;
                city?: string | null;
                state?: string | null;
                zip?: string | null;
              } | null;
            }) => {
              const address = formatAddress(
                record.eligible_participant_address
              );
              return address === "—" ? "" : address;
            }}
          />
          <TextField source="school_name" label="High school" />
          <DateField source="graduation_date" label="Graduation" />
          <FunctionField
            source="school_address"
            label="School address"
            sortable={false}
            render={(record: {
              school_address?: {
                street?: string | null;
                city?: string | null;
                state?: string | null;
                zip?: string | null;
              } | null;
            }) => {
              const address = formatAddress(record.school_address);
              return address === "—" ? "" : address;
            }}
          />
          <TextField source="sat_score" label="SAT" />
          <TextField source="act_score" label="ACT" />
          <FunctionField
            source="transcript"
            label="Transcript"
            sortable={false}
            render={mediaCell("transcript", "Transcript")}
          />
          <FunctionField
            source="test_scores"
            label="SAT/ACT file"
            sortable={false}
            render={mediaCell("test_scores", "SAT/ACT file")}
          />
          <TextField source="first_year" label="First year" />
          <TextField source="credits_completed" label="Credits completed" />
          <TextField source="credits_required" label="Credits required" />
          <TextField source="college_gpa" label="College GPA" />
          <FunctionField
            source="education_type"
            label="Education type"
            render={(record: { education_type?: string }) =>
              record.education_type
                ? EDUCATION_LABELS[record.education_type] ||
                  record.education_type
                : ""
            }
          />
          <TextField source="major" label="Major" />
          <TextField source="awards" label="Awards / recognition" />
          <FunctionField
            source="recommender1_name"
            label="Recommender 1"
            sortable={false}
            render={(record: {
              recommender1_name?: {
                first?: string | null;
                last?: string | null;
              } | null;
            }) => {
              const name = formatPersonName(record.recommender1_name);
              return name === "—" ? "" : name;
            }}
          />
          <TextField source="recommender1_email" label="Recommender 1 email" />
          <TextField source="recommender1_phone" label="Recommender 1 phone" />
          <FunctionField
            source="recommendation_letter_1"
            label="Letter 1"
            sortable={false}
            render={mediaCell("recommendation_letter_1", "Letter 1")}
          />
          <FunctionField
            source="recommender2_name"
            label="Recommender 2"
            sortable={false}
            render={(record: {
              recommender2_name?: {
                first?: string | null;
                last?: string | null;
              } | null;
            }) => {
              const name = formatPersonName(record.recommender2_name);
              return name === "—" ? "" : name;
            }}
          />
          <TextField source="recommender2_email" label="Recommender 2 email" />
          <TextField source="recommender2_phone" label="Recommender 2 phone" />
          <FunctionField
            source="recommendation_letter_2"
            label="Letter 2"
            sortable={false}
            render={mediaCell("recommendation_letter_2", "Letter 2")}
          />
          <FunctionField
            source="financial_resources"
            label="Financial aid"
            sortable={false}
            render={(record: Record<string, unknown>) => {
              const rows = listFinancialResources(record);
              if (rows.length === 0) return "";
              const first = rows[0].institution || "Aid";
              return rows.length === 1 ? first : `${rows.length}: ${first}`;
            }}
          />
          <FunctionField
            source="essay"
            label="Essay"
            sortable={false}
            render={mediaCell("essay", "Essay")}
          />
          <FunctionField
            source="biography"
            label="Biography"
            sortable={false}
            render={mediaCell("biography", "Biography")}
          />
          <FunctionField
            source="photograph"
            label="Photograph"
            sortable={false}
            render={mediaCell("photograph", "Photograph")}
          />
          <FunctionField
            source="applicant_pdf"
            label="Application PDF"
            sortable={false}
            render={mediaCell("applicant_pdf", "Application PDF")}
          />
          <TextField source="age_confirm" label="Age confirmation" />
          <BooleanField
            source="applicant_certification"
            label="Applicant certified"
          />
          <DateField
            source="applicant_certification_date"
            label="Certification date"
          />
          <FunctionField
            source="guardian_name"
            label="Guardian"
            sortable={false}
            render={(record: {
              guardian_name?: {
                first?: string | null;
                last?: string | null;
              } | null;
            }) => {
              const name = formatPersonName(record.guardian_name);
              return name === "—" ? "" : name;
            }}
          />
          <BooleanField
            source="guardian_certification"
            label="Guardian certified"
          />
          <DateField
            source="guardian_certification_date"
            label="Guardian cert. date"
          />
          <TextField source="review_notes" label="Review notes" />
        </AgDatagrid>
      </List>
    </Box>
  );
};

export default ScholarshipApplicationList;
