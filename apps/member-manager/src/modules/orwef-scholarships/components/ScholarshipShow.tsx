import React from "react";
import { Show, useRecordContext } from "react-admin";
import { Box, Typography } from "@mui/material";
import {
  asDateString,
  EDUCATION_LABELS,
  formatAddress,
  formatMoney,
  formatPersonName,
  PacketField,
  PacketLayout,
  PacketSection,
  RELATIONSHIP_LABELS,
  ReviewPageBar,
  reviewResourceSx,
  StaffSidebar,
  StatusChip,
} from "../../_components/review-packet";
import { useSummaryTokens } from "../../grant-manager/grants/components/summary/tokens";
import { STATUS_META, ScholarshipStatus } from "../helpers/metrics";
import { listFinancialResources } from "../helpers/financialResources";
import MediaLink from "./MediaLink";
import PacketLetterhead from "./PacketLetterhead";
import ScholarshipPrintButton from "./ScholarshipPrintButton";
import type { ScholarshipPacketRecord } from "../helpers/printScholarshipPacket";

const SCHOLARSHIP_BACK = "/orwef-scholarships/dashboard";

type ScholarshipRecord = ScholarshipPacketRecord & {
  application_status?: ScholarshipStatus;
  review_notes?: string | null;
};

const applicantTitle = (record?: ScholarshipRecord) => {
  if (record == null) return "Scholarship Application";
  const name = `${record.applicant_first_name || ""} ${record.applicant_last_name || ""}`.trim();
  return name || "Scholarship Application";
};

const ScholarshipPacket = () => {
  const record = useRecordContext<ScholarshipRecord>();
  const T = useSummaryTokens();
  const status = record?.application_status;
  const meta = status != null ? STATUS_META[status] : null;
  const financialResources = listFinancialResources(record);
  const submitted =
    asDateString(record?.submission_date) ||
    asDateString(record?.createdAt) ||
    null;

  return (
    <PacketLayout
      heading={
        <ReviewPageBar
          title={applicantTitle(record)}
          backTo={SCHOLARSHIP_BACK}
          showEdit
          extraActions={
            <ScholarshipPrintButton
              record={record}
              sx={{ color: "white" }}
            />
          }
        />
      }
      sidebar={
        <StaffSidebar
          chip={
            <StatusChip
              label={meta?.label || status || "Unknown"}
              colorKey={meta?.colorKey || "closed"}
            />
          }
          notes={record?.review_notes}
          extra={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Submitted {submitted || "—"}
            </Typography>
          }
        />
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          bgcolor: T.ink,
          p: { xs: 1.25, sm: 2 },
          borderRadius: "0 0 12px 12px",
          border: `1px solid ${T.line}`,
        }}
      >
        <PacketLetterhead
          meta={
            submitted
              ? `Official application packet · Submitted ${submitted}`
              : "Official application packet"
          }
        />

        <PacketSection title="Personal Data">
          <PacketField label="First name" value={record?.applicant_first_name} />
          <PacketField label="Middle name" value={record?.applicant_middle_name} />
          <PacketField label="Last name" value={record?.applicant_last_name} />
          <PacketField label="Email" value={record?.applicant_email} email />
          <PacketField label="Phone" value={record?.applicant_phone} />
          <PacketField
            label="Address"
            value={[
              record?.applicant_street,
              [record?.applicant_city, record?.applicant_state]
                .filter(Boolean)
                .join(", "),
              record?.applicant_zip,
            ]
              .filter(Boolean)
              .join("\n")}
            span
          />
        </PacketSection>

        <PacketSection title="Eligibility Criteria">
          <PacketField label="Water system" value={record?.system_name} />
          <PacketField
            label="Relationship"
            value={
              record?.relationship
                ? RELATIONSHIP_LABELS[record.relationship] ||
                  record.relationship
                : null
            }
          />
          <PacketField
            label="Eligible participant"
            value={formatPersonName(record?.eligible_participant_name)}
          />
          <PacketField label="Title" value={record?.eligible_participant_title} />
          <PacketField
            label="Participant email"
            value={record?.eligible_participant_email}
            email
          />
          <PacketField
            label="Participant phone"
            value={record?.eligible_participant_phone}
          />
          <PacketField
            label="Participant address"
            value={formatAddress(record?.eligible_participant_address)}
            span
          />
        </PacketSection>

        <PacketSection title="High School Data">
          <PacketField label="School" value={record?.school_name} />
          <PacketField
            label="Graduation date"
            value={asDateString(record?.graduation_date)}
          />
          <PacketField label="GPA" value={record?.gpa} />
          <PacketField label="SAT" value={record?.sat_score} />
          <PacketField label="ACT" value={record?.act_score} />
          <PacketField
            label="School address"
            value={formatAddress(record?.school_address)}
            span
          />
          <PacketField label="Transcript" span>
            <MediaLink
              file={record?.transcript}
              label="Transcript"
              variant="packet"
            />
          </PacketField>
          <PacketField label="Test scores" span>
            <MediaLink
              file={record?.test_scores}
              label="Test scores"
              variant="packet"
            />
          </PacketField>
        </PacketSection>

        <PacketSection title="College / University Data">
          <PacketField label="First year" value={record?.first_year} />
          <PacketField
            label="Education type"
            value={
              record?.education_type
                ? EDUCATION_LABELS[record.education_type] ||
                  record.education_type
                : null
            }
          />
          <PacketField label="Credits completed" value={record?.credits_completed} />
          <PacketField label="Credits required" value={record?.credits_required} />
          <PacketField label="College GPA" value={record?.college_gpa} />
          <PacketField label="Major" value={record?.major} />
        </PacketSection>

        <PacketSection title="Awards and Recognition" columns={1}>
          <PacketField
            label="Awards, memberships, or special recognition"
            value={record?.awards}
            span
          />
        </PacketSection>

        <PacketSection title="Letters of Recommendation">
          <PacketField
            label="Recommender 1"
            value={formatPersonName(record?.recommender1_name)}
          />
          <PacketField
            label="Recommender 1 email"
            value={record?.recommender1_email}
            email
          />
          <PacketField
            label="Recommender 1 phone"
            value={record?.recommender1_phone}
          />
          <PacketField label="Letter 1" span>
            <MediaLink
              file={record?.recommendation_letter_1}
              label="Recommendation 1"
              variant="packet"
            />
          </PacketField>
          <PacketField
            label="Recommender 2"
            value={formatPersonName(record?.recommender2_name)}
          />
          <PacketField
            label="Recommender 2 email"
            value={record?.recommender2_email}
            email
          />
          <PacketField
            label="Recommender 2 phone"
            value={record?.recommender2_phone}
          />
          <PacketField label="Letter 2" span>
            <MediaLink
              file={record?.recommendation_letter_2}
              label="Recommendation 2"
              variant="packet"
            />
          </PacketField>
        </PacketSection>

        <PacketSection title="Financial Data">
          {financialResources.length === 0 ? (
            <PacketField label="Financial aid" value={null} span />
          ) : (
            financialResources.map((row, index) => (
              <React.Fragment key={`${row.institution || "aid"}-${index}`}>
                <PacketField
                  label={`Aid ${index + 1} institution`}
                  value={row.institution}
                />
                <PacketField
                  label={`Aid ${index + 1} amount`}
                  value={formatMoney(row.amount)}
                />
              </React.Fragment>
            ))
          )}
        </PacketSection>

        <PacketSection title="Essay" columns={1}>
          <PacketField label="Essay file" span>
            <MediaLink file={record?.essay} label="Essay" variant="packet" />
          </PacketField>
        </PacketSection>

        <PacketSection title="Biography" columns={1}>
          <PacketField label="Biography file" span>
            <MediaLink
              file={record?.biography}
              label="Biography"
              variant="packet"
            />
          </PacketField>
        </PacketSection>

        <PacketSection title="Photograph" columns={1}>
          <PacketField label="Applicant photograph" span>
            <MediaLink
              file={record?.photograph}
              label="Photograph"
              variant="packet"
            />
          </PacketField>
        </PacketSection>

        <PacketSection title="Certification">
          <PacketField label="Age confirmation" value={record?.age_confirm} span />
          <PacketField
            label="Applicant certified"
            value={record?.applicant_certification}
          />
          <PacketField
            label="Certification date"
            value={asDateString(record?.applicant_certification_date)}
          />
          <PacketField
            label="Guardian"
            value={formatPersonName(record?.guardian_name)}
          />
          <PacketField
            label="Guardian certified"
            value={record?.guardian_certification}
          />
          <PacketField
            label="Guardian certification date"
            value={asDateString(record?.guardian_certification_date)}
          />
        </PacketSection>
      </Box>
    </PacketLayout>
  );
};

const ScholarshipShow = () => (
  <Show
    title="ORWEF Scholarship"
    component="div"
    actions={false}
    sx={reviewResourceSx}
    queryOptions={{
      meta: { populate: "*", raw: true },
    }}
  >
    <ScholarshipPacket />
  </Show>
);

export default ScholarshipShow;
