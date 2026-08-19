import React from "react";
import { Show, useRecordContext } from "react-admin";
import { Typography } from "@mui/material";
import {
  asDateString,
  PacketField,
  PacketLayout,
  PacketSection,
  ReviewPageBar,
  reviewResourceSx,
  StaffSidebar,
  StatusChip,
} from "../../_components/review-packet";
import { NOMINATION_META, NominationStatus } from "../helpers/metrics";
import MediaLink from "../../orwef-scholarships/components/MediaLink";
import {
  boardMembersSummary,
  contactSummary,
  employeeTotal,
  watersystemCounty,
  watersystemName,
} from "../helpers/recordDisplay";

const AWARD_BACK = "/orwa-awards/dashboard";

type AwardRecord = Record<string, unknown> & {
  nominee_name?: string;
  email?: string;
  daytime_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  award_type?: string;
  award_year?: number;
  nomination_status?: NominationStatus;
  review_notes?: string | null;
  submission_date?: string | null;
  system_name?: string;
  award_name_printed?: string;
  watersystem?: { name?: string; county?: string | null } | null;
  operation_start_date?: string | null;
  employment_date?: string | null;
  current_members?: number | null;
  beginning_members?: number | null;
  clerical_employees?: number | null;
  operation_maintenance_employees?: number | null;
  management_employees?: number | null;
  biography_method?: string | null;
  biography_text?: string | null;
  biography_file?: unknown;
  photographs?: unknown;
  board_list_method?: string | null;
  board_list_file?: unknown;
  board_members?: unknown;
  supporting_documents?: unknown;
  nomination_pdf?: unknown;
  justification?: string | null;
  nominator_first_name?: string;
  nominator_last_name?: string;
  nominator_address?: string;
  nominator_address_2?: string;
  nominator_city?: string;
  nominator_state?: string;
  nominator_zip?: string;
  nominator_country?: string;
  nominator_phone?: string;
  nominator_email?: string;
  contact?: {
    first?: string;
    last?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    name?: string;
  } | null;
};

const nomineeTitle = (record?: AwardRecord) =>
  record?.nominee_name || "Award Nomination";

const AwardPacket = () => {
  const record = useRecordContext<AwardRecord>();
  const status = record?.nomination_status;
  const meta = status != null ? NOMINATION_META[status] : null;

  return (
    <PacketLayout
      heading={
        <ReviewPageBar
          title={nomineeTitle(record)}
          backTo={AWARD_BACK}
          showEdit
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
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {record?.award_type || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Year {record?.award_year ?? "—"}
                {record?.submission_date
                  ? ` · Submitted ${asDateString(record.submission_date)}`
                  : ""}
              </Typography>
            </>
          }
        />
      }
    >
      <PacketSection title="Nominee Information">
        <PacketField label="Nominee Full Name" value={record?.nominee_name} />
        <PacketField
          label="Name as printed on award"
          value={record?.award_name_printed || record?.system_name}
        />
        <PacketField label="Please select the type of award" value={record?.award_type} />
        <PacketField label="Email Address" value={record?.email} email />
        <PacketField label="Daytime Phone" value={record?.daytime_phone} />
        <PacketField label="Award Year" value={record?.award_year} />
        <PacketField
          label="Street Address"
          value={[
            record?.address,
            [record?.city, record?.state].filter(Boolean).join(", "),
            record?.zip,
          ]
            .filter(Boolean)
            .join("\n")}
          span
        />
        <PacketField label="Linked Contact" value={contactSummary(record || {})} />
      </PacketSection>

      <PacketSection title="Nominator Information">
        <PacketField label="First" value={record?.nominator_first_name} />
        <PacketField label="Last" value={record?.nominator_last_name} />
        <PacketField label="Nominator's Email" value={record?.nominator_email} email />
        <PacketField label="Nominator's Phone" value={record?.nominator_phone} />
        <PacketField label="Country" value={record?.nominator_country} />
        <PacketField
          label="Nominator's Address"
          value={[
            record?.nominator_address,
            record?.nominator_address_2,
            [record?.nominator_city, record?.nominator_state]
              .filter(Boolean)
              .join(", "),
            record?.nominator_zip,
          ]
            .filter(Boolean)
            .join("\n")}
          span
        />
      </PacketSection>

      <PacketSection title="System Information">
        <PacketField label="System Name" value={record?.system_name} />
        <PacketField
          label="Water System"
          value={watersystemName(record || {})}
        />
        <PacketField
          label="County"
          value={watersystemCounty(record || {})}
        />
        <PacketField
          label="Date System Began Operation"
          value={asDateString(record?.operation_start_date)}
        />
        <PacketField
          label="Date Employed"
          value={asDateString(record?.employment_date)}
        />
        <PacketField
          label="Number of Beginning Meter Connections"
          value={record?.beginning_members}
        />
        <PacketField
          label="Number of Current Meter Connections"
          value={record?.current_members}
        />
      </PacketSection>

      <PacketSection title="Employee Information">
        <PacketField label="Clerical Employees" value={record?.clerical_employees} />
        <PacketField
          label="Operation & Maintenance Employees"
          value={record?.operation_maintenance_employees}
        />
        <PacketField
          label="Management Employees"
          value={record?.management_employees}
        />
        <PacketField label="Total Employees" value={employeeTotal(record || {})} />
      </PacketSection>

      <PacketSection title="Justification" columns={1}>
        <PacketField
          label="What makes the nominee deserving of this award?"
          value={record?.justification}
          span
        />
      </PacketSection>

      <PacketSection title="Biography">
        <PacketField
          label="How would you like to provide your biography?"
          value={record?.biography_method}
        />
        <PacketField label="Biography" value={record?.biography_text} span />
        <PacketField label="Biography File" span>
          <MediaLink
            file={record?.biography_file}
            label="Biography"
            variant="packet"
          />
        </PacketField>
      </PacketSection>

      <PacketSection title="Photographs" columns={1}>
        <PacketField label="Photographs" span>
          <MediaLink
            file={record?.photographs}
            label="Photographs"
            variant="packet"
          />
        </PacketField>
      </PacketSection>

      <PacketSection title="Board Members & Employees" columns={1}>
        <PacketField
          label="Provide Board Members & Employee List via"
          value={record?.board_list_method}
        />
        <PacketField label="Upload Board Member & Employee List" span>
          <MediaLink
            file={record?.board_list_file}
            label="Board Member & Employee List"
            variant="packet"
          />
        </PacketField>
        <PacketField
          label="Board Members & Employees"
          value={boardMembersSummary(record?.board_members)}
          span
        />
      </PacketSection>

      <PacketSection title="Supporting Documents" columns={1}>
        <PacketField label="Supporting Documents" span>
          <MediaLink
            file={record?.supporting_documents}
            label="Supporting Documents"
            variant="packet"
          />
        </PacketField>
        <PacketField label="Nomination packet PDF" span>
          <MediaLink
            file={record?.nomination_pdf}
            label="Nomination packet PDF"
            variant="packet"
          />
        </PacketField>
      </PacketSection>
    </PacketLayout>
  );
};

const AwardShow = () => (
  <Show
    title="ORWA Award Nomination"
    component="div"
    actions={false}
    sx={reviewResourceSx}
    queryOptions={{
      meta: { populate: "*", raw: true },
    }}
  >
    <AwardPacket />
  </Show>
);

export default AwardShow;
