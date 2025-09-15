import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
import { formatNumber } from "../../../../helpers/Formators";
import dayjs from "dayjs";

const exportPayouts = async (
  RecordList: RaRecord[],
  title: string,
  dataProvider: DataProvider
) => {
  let runningBalance = 0; // Initialize running balance

  const data = await Promise.all(
    RecordList.map(async (payout) => {
      const filteredRecord = {} as Record<string, string>;

      filteredRecord["Transaction Date"] = payout.transaction_date
        ? new Intl.DateTimeFormat("en-US").format(
            new Date(payout.transaction_date)
          )
        : "";

      // Fetch the payout status using the status ID
      const { data: payoutStatus } =
        typeof payout.payout_status === "number"
          ? await dataProvider.getOne("payout-statuses", {
              id: payout.payout_status,
            })
          : { data: { name: "" } };
      // Format amount: add parentheses for negatives and currency formatting
      filteredRecord["Amount"] =
        payout.amount < 0
          ? `(${formatNumber(Math.abs(payout.amount))})`
          : `${formatNumber(payout.amount)}`;

      // Add status
      filteredRecord["Status"] = payoutStatus.name || "Unknown";

      runningBalance += payout.amount || 0;
      filteredRecord["Total Balance"] = formatNumber(runningBalance)    

      return filteredRecord;
    })
  );

  // Convert to CSV and download
  return jsonExport(data, (err: Error, csv: string) => {
    if (err) {
      console.error("Export Error:", err);
      return;
    }
    downloadCSV(csv, `${title}`);
  });
};

export default exportPayouts;
