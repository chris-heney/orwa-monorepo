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

const AWARD_BACK = "/orwa-awards/dashboard";

type AwardRecord = Record<string, unknown> & {
  nominee_name?: string;
  email?: string;
  daytime_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  award_type?: string;
  award_year?: number;
  nomination_status?: NominationStatus;
  review_notes?: string | null;
  submission_date?: string | null;
  system_name?: string;
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
  board_list_file?: unknown;
  board_members?: unknown;
  supporting_documents?: unknown;
  nomination_pdf?: unknown;
  nomination_description?: string | null;
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
};

const nomineeTitle = (record?: AwardRecord) =>
  record?.nominee_name || "Award Nomination";

const employeeTotal = (record?: AwardRecord) => {
  const total =
    Number(record?.clerical_employees || 0) +
    Number(record?.operation_maintenance_employees || 0) +
    Number(record?.management_employees || 0);
  return Number.isFinite(total) ? total : 0;
};

const AwardPacket = () => {
  const record = useRecordContext<AwardRecord>();
  const status = record?.nomination_status;
  const meta = status != null ? NOMINATION_META[status] : null;

  return (
    <PacketLayout
      heading={
        <ReviewPageBar title={nomineeTitle(record)} backTo={AWARD_BACK} showEdit />
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
        <PacketField label="Nominee" value={record?.nominee_name} />
        <PacketField label="Award type" value={record?.award_type} />
        <PacketField label="Email" value={record?.email} email />
        <PacketField label="Daytime phone" value={record?.daytime_phone} />
        <PacketField label="County" value={record?.county} />
        <PacketField label="Award year" value={record?.award_year} />
        <PacketField
          label="Address"
          value={[
            record?.address,
            [record?.city, record?.state].filter(Boolean).join(", "),
            record?.zip,
          ]
            .filter(Boolean)
            .join("\n")}
          span
        />
      </PacketSection>

      <PacketSection title="Nominator Information">
        <PacketField
          label="Nominator"
          value={[record?.nominator_first_name, record?.nominator_last_name]
            .filter(Boolean)
            .join(" ")}
        />
        <PacketField label="Email" value={record?.nominator_email} email />
        <PacketField label="Phone" value={record?.nominator_phone} />
        <PacketField label="Country" value={record?.nominator_country} />
        <PacketField
          label="Address"
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
        <PacketField label="System name" value={record?.system_name} />
        <PacketField
          label="Date system began operation"
          value={asDateString(record?.operation_start_date)}
        />
        <PacketField
          label="Date employed"
          value={asDateString(record?.employment_date)}
        />
        <PacketField
          label="Beginning meter connections"
          value={record?.beginning_members}
        />
        <PacketField
          label="Current meter connections"
          value={record?.current_members}
        />
      </PacketSection>

      <PacketSection title="Employee Counts">
        <PacketField label="Clerical" value={record?.clerical_employees} />
        <PacketField
          label="Operation & maintenance"
          value={record?.operation_maintenance_employees}
        />
        <PacketField label="Management" value={record?.management_employees} />
        <PacketField label="Total employees" value={employeeTotal(record)} />
      </PacketSection>

      <PacketSection title="Nomination Description" columns={1}>
        <PacketField
          label="Why this nominee deserves the award"
          value={record?.nomination_description}
          span
        />
      </PacketSection>

      <PacketSection title="Biography / Photographs">
        <PacketField label="Biography method" value={record?.biography_method} />
        <PacketField label="Biography text" value={record?.biography_text} span />
        <PacketField label="Biography file" span>
          <MediaLink
            file={record?.biography_file}
            label="Biography file"
            variant="packet"
          />
        </PacketField>
        <PacketField label="Photographs" span>
          <MediaLink
            file={record?.photographs}
            label="Photographs"
            variant="packet"
          />
        </PacketField>
      </PacketSection>

      <PacketSection title="Supporting Documents">
        <PacketField label="Board list file" span>
          <MediaLink
            file={record?.board_list_file}
            label="Board list file"
            variant="packet"
          />
        </PacketField>
        <PacketField label="Supporting documents" span>
          <MediaLink
            file={record?.supporting_documents}
            label="Supporting documents"
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
      meta: { populate: "*" },
    }}
  >
    <AwardPacket />
  </Show>
);

export default AwardShow;
