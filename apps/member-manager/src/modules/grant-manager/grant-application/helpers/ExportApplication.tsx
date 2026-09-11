import {
  ConfigurableDatagridColumn,
  DataProvider,
} from "react-admin";
import {
  computeBalance,
  isCountableTowardAward,
  sumPayoutAmounts,
} from "../../payouts/helpers/payoutAmounts";
import { IGrantApplication } from "../GrantApplicationTypes";
import {
  readExportColumn,
  relationDisplayValue,
  selectExportColumns,
} from "../../../../helpers/fetchRelatedRecord";
import downloadJsonAsCsv from "../../../../helpers/downloadJsonAsCsv";

/**
 * `meta` for the Applications export query (`ListManifest.exportMeta`).
 *
 * `raw: true` matters as much as the populate: the react-admin formatter
 * collapses populated relations back to documentIds, which is why Phone and
 * friends exported blank while the grid showed them.
 *
 * `payouts` is populated nested (never `payouts=*` — Strapi 5 walks the
 * inverse `application` link and 400s, see BalanceField), so Total Paid Out
 * and Balance are arithmetic on the row instead of two requests per row.
 */
export const APPLICATION_EXPORT_META = {
  raw: true,
  populate: {
    point_of_contact: true,
    status: true,
    selected_projects: true,
    approved_projects: true,
    payouts: { populate: { payout_status: true } },
  },
} as const;

const projectNames = (projects: unknown): string =>
  Array.isArray(projects)
    ? projects
        .map((project) => (project as { name?: unknown })?.name)
        .filter((name): name is string => typeof name === "string" && name !== "")
        .join(", ")
    : "";

/**
 * Applications → CSV.
 *
 * Every value is read off the record the export query already returned, so the
 * whole download is ONE request. This used to issue four per row (contact,
 * status, balance, payouts), which made a few hundred applications take
 * minutes; `APPLICATION_EXPORT_META` populates all four instead.
 */
const ExportApplications = async (
  RecordList: IGrantApplication[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  // Kept for signature compatibility with the other per-tab exporters.
  _dataProvider?: DataProvider
) => {
  // The user's on-screen column order (see `selectExportColumns`).
  const columns = selectExportColumns(availableColumns, columnIds);

  const data = RecordList.map((application) => {
    const filteredRecord = {} as Record<string, string>;

    const contact = (application.point_of_contact ?? {}) as unknown as Record<
      string,
      unknown
    >;
    const email =
      (application.email as string) || (contact.email as string) || "";
    const phone = (contact.phone as string) || "";
    const status = relationDisplayValue(application.status);

    for (const column of columns) {
      if (!column.label || column.label.trim() === "") continue;

      let value: unknown;

      switch (column.label) {
        case "Balance":
          value = computeBalance(application);
          break;
        case "Total Paid Out":
          value = sumPayoutAmounts(application.payouts, isCountableTowardAward);
          break;
        case "Selected Projects":
          value = projectNames(application.selected_projects);
          break;
        case "Projects Approved":
          value = projectNames(application.approved_projects);
          break;
        case "COR":
          value = application.change_order_request?.includes("Yes") ? "Yes" : "No";
          break;
        case "Closed":
          value = application.closed_out ? "Yes" : "No";
          break;
        case "Email":
          value = email;
          break;
        case "Phone":
          value = phone;
          break;
        case "Status":
          value = status;
          break;
        default:
          value = relationDisplayValue(readExportColumn(application, column));
      }

      filteredRecord[column.label] = value as string;
    }

    return filteredRecord;
  });

  return downloadJsonAsCsv(data, `${title}`);
};

export default ExportApplications;
