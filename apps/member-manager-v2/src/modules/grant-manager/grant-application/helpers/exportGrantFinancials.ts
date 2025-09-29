// utils/exportHelpers.ts
import dayjs from "dayjs";
import jsonExport from "jsonexport/dist";
import { downloadCSV } from "react-admin";
import { formatNumber } from "../../../../helpers/Formators";

interface ExportOptions {
  filename: string;
  columns: string[];
  headers?: Record<string, string>;
}

interface ApplicationData {
  closed: string;
  date: string;
  id: number;
  name: string;
  COR: string;
  amount: string;
  status: string;
  awardAmount: number;
  balance: number;
  requestedAmount: number;
  cumulativeAmount: number;
}

const exportData = async (data: any[], options: ExportOptions) => {
  const formattedData = data.map((item) => {
    const formattedItem: Record<string, any> = {};
    options.columns.forEach((column) => {
      formattedItem[options.headers?.[column] || column] = item[column];
    });
    return formattedItem;
  });

  return jsonExport(formattedData, (err: Error, csv: string) => {
    downloadCSV(csv, options.filename);
  });
};

export const exportApplications = (
  data: any[],
  amountType: "award" | "requested" | "balance"
) => {
  const columns = [
    "closed",
    "date",
    "id",
    "name",
    "COR",
    "amount",
    "CumulativeAmount",
    "status",
  ];

  const formattedData = data.map((app: ApplicationData) => ({
    // Checkmark x for closed applications
    closed: app.closed ? "✓" : "x",
    date: dayjs(app.date).format("MM/DD/YYYY"),
    id: app.id,
    name: app.name,
    COR: app.COR,
    amount: formatNumber(
      amountType === "award"
        ? app.awardAmount
        : amountType === "balance"
        ? app.balance
        : app.requestedAmount
    ),
    CumulativeAmount: formatNumber(app.cumulativeAmount),
    status: app.status, // Exclude color from export
  }));

  return exportData(formattedData, {
    filename: `Applications-Export-${dayjs().format("YYYY-MM-DD")}`,
    columns,
    headers: {
      amount:
        amountType === "award"
          ? "Award Amount"
          : amountType === "requested"
          ? "Requested Amount"
          : "Balance",
    },
  });
};

export const exportPayouts = (data: any[]) => {
  const columns = ["date", "name", "amount", "CumulativeAmount", "status"];

  const formattedData = data.map((payout) => ({
    date: dayjs(payout.date).format("MM/DD/YYYY"),
    name: payout.name,
    amount: formatNumber(payout.amount),
    CumulativeAmount: formatNumber(payout.cumulativeAmount),
    status: payout.status,
  }));

  return exportData(formattedData, {
    filename: `Payouts-Export-${dayjs().format("YYYY-MM-DD")}`,
    columns,
    headers: {
      status: "Type",
    },
  });
};
