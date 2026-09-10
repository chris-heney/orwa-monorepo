import React from "react";
import {
  DateField,
  FunctionField,
  ListView,
  NumberField,
  TextField,
} from "react-admin";
import AgDatagrid from "../../_components/AgDatagrid";
import CustomPagination from "../../_components/CustomPagination";
import { useAwardColumnDefaults } from "../helpers/useAwardColumnDefaults";
import {
  boardMembersSummary,
  contactSummary,
  employeeTotal,
  hasMedia,
  mediaSummary,
  truncateText,
  watersystemCounty,
  watersystemName,
} from "../helpers/recordDisplay";
import {
  AWARD_SELECTED_IDS_KEY,
  AwardRowPrintButton,
} from "./AwardPrintButton";

export const AG_PREFS_KEY = "agGrid.award-nominations";

/** Relations the grid columns read (manifest `list.meta.populate`). */
export const NOMINATION_LIST_POPULATE = {
  watersystem: true,
  photographs: true,
  biography_file: true,
  board_list_file: true,
  supporting_documents: true,
  nomination_pdf: true,
  contact: true,
};

/**
 * Nominations tab panel — renders inside the framework's ListScope (the
 * permanent search / year / region / type filter comes from `manifest.tsx`),
 * so there is no second `List` here: count, Export, Columns, Print Selected
 * and the Filters drawer all share this ListBase.
 */
const AwardNominationList = () => {
  useAwardColumnDefaults();

  return (
    <ListView
      actions={false}
      title=" "
      component="div"
      pagination={<CustomPagination />}
      sx={{
        width: 1,
        minWidth: 0,
        "& .RaList-main": { marginTop: 0 },
        "& .RaList-content": { boxShadow: "none" },
        ".RaList-actions": { p: 0, minHeight: 0 },
      }}
    >
      <AgDatagrid
        preferenceKey={AG_PREFS_KEY}
        rowClick="show"
        rowSelection
        selectionStoreKey={AWARD_SELECTED_IDS_KEY}
        rowActions={(record) => <AwardRowPrintButton record={record} />}
      >
        <TextField source="nominee_name" label="Nominee" />
        <TextField source="email" label="Email" />
        <TextField source="system_name" label="System" />
        <TextField
          source="award_name_printed"
          label="Name as printed on award"
        />
        <TextField source="award_type" label="Award" />
        <TextField source="award_year" label="Year" />
        <TextField source="nomination_status" label="Status" />
        <FunctionField
          label="County"
          source="watersystem.county"
          sortable={false}
          render={(record: {
            watersystem?: { county?: string | null } | null;
          }) => watersystemCounty(record) || "—"}
        />

        <FunctionField
          label="Water System"
          render={(record: { watersystem?: { name?: string } }) =>
            watersystemName(record)
          }
          sortable={false}
        />
        <DateField
          source="operation_start_date"
          label="Date System Began Operation"
        />
        <DateField source="employment_date" label="Date Employed" />
        <NumberField
          source="beginning_members"
          label="Number of Beginning Meter Connections"
        />
        <NumberField
          source="current_members"
          label="Number of Current Meter Connections"
        />

        <TextField source="nominator_first_name" label="Nominator First" />
        <TextField source="nominator_last_name" label="Nominator Last" />
        <TextField
          source="nominator_address"
          label="Nominator Street Address"
        />
        <TextField source="nominator_address_2" label="Address Line 2" />
        <TextField source="nominator_city" label="Nominator City" />
        <TextField
          source="nominator_state"
          label="Nominator State / Province / Region"
        />
        <TextField
          source="nominator_zip"
          label="Nominator ZIP / Postal Code"
        />
        <TextField source="nominator_country" label="Country" />
        <TextField source="nominator_phone" label="Nominator's Phone" />
        <TextField source="nominator_email" label="Nominator's Email" />

        <TextField source="daytime_phone" label="Daytime Phone" />
        <TextField source="address" label="Street Address" />
        <TextField source="city" label="City" />
        <TextField source="state" label="State" />
        <TextField source="zip" label="ZIP Code" />
        <FunctionField
          label="Linked Contact"
          render={(record: Parameters<typeof contactSummary>[0]) =>
            contactSummary(record)
          }
          sortable={false}
        />

        <NumberField source="clerical_employees" label="Clerical Employees" />
        <NumberField
          source="operation_maintenance_employees"
          label="Operation & Maintenance Employees"
        />
        <NumberField
          source="management_employees"
          label="Management Employees"
        />
        <FunctionField
          label="Total Employees"
          render={(record: Parameters<typeof employeeTotal>[0]) =>
            employeeTotal(record)
          }
          sortable={false}
        />

        <FunctionField
          label="What makes the nominee deserving of this award?"
          source="justification"
          render={(record: { justification?: string }) =>
            truncateText(record.justification)
          }
        />

        <TextField
          source="biography_method"
          label="How would you like to provide your biography?"
        />
        <FunctionField
          label="Biography"
          source="biography_text"
          render={(record: { biography_text?: string }) =>
            truncateText(record.biography_text)
          }
        />
        <FunctionField
          label="Biography File"
          render={(record: { biography_file?: unknown }) =>
            mediaSummary(record.biography_file)
          }
          sortable={false}
        />

        <FunctionField
          label="Photographs"
          render={(record: { photographs?: unknown }) =>
            mediaSummary(record.photographs)
          }
          sortable={false}
        />

        <TextField
          source="board_list_method"
          label="Provide Board Members & Employee List via"
        />
        <FunctionField
          label="Board Member & Employee List File"
          render={(record: { board_list_file?: unknown }) =>
            mediaSummary(record.board_list_file)
          }
          sortable={false}
        />
        <FunctionField
          label="Board Members & Employees"
          render={(record: { board_members?: unknown }) =>
            truncateText(boardMembersSummary(record.board_members), 100)
          }
          sortable={false}
        />

        <FunctionField
          label="Supporting Documents"
          render={(record: { supporting_documents?: unknown }) =>
            mediaSummary(record.supporting_documents)
          }
          sortable={false}
        />
        <FunctionField
          label="Has Nomination PDF"
          render={(record: { nomination_pdf?: unknown }) =>
            hasMedia(record.nomination_pdf)
          }
          sortable={false}
        />

        <DateField source="submission_date" label="Submitted" />
        <FunctionField
          label="Review Notes"
          source="review_notes"
          render={(record: { review_notes?: string }) =>
            truncateText(record.review_notes)
          }
        />
      </AgDatagrid>
    </ListView>
  );
};

export default AwardNominationList;
