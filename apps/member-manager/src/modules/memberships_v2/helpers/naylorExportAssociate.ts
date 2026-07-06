import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  DataProvider,
} from "react-admin";
import { isMembershipActiveByExpiration } from "../../_helpers/getExpirationDate";
import { IAssociate } from "../associate/AssociateInterface";

export const NaylorExportAssociate = async (
  RecordList: IAssociate[],
  title: string,
  dataProvider: DataProvider
) => {
  const headers = {
    "Company Name": "name",
    "All Category Listings": "category",
    "Primary ADDRESS": "address_street",
    "Primary City": "address_city",
    "Primary State": "address_state",
    "Primary Zip": "address_zip",
    "Secondary ADDRESS": "mailing_address_street",
    "Secondary City": "mailing_address_city",
    "Secondary State": "mailing_address_state",
    "Secondary Zip": "mailing_address_zip",
    Website: "website",
    "Primary Associate Job Title": "primary_contact.title",
    "Primary Name": "primary_contact.name",
    Phone: "phone",
    "Primary E-Mail": "email",
  };

  // Resolve all asynchronous operations and build the filtered data
  const data = await Promise.all(
    RecordList.filter((associate) =>
      isMembershipActiveByExpiration(
        associate.payment_previous_date,
        associate.payment_last_date
      )
    ).map(async (record: any) => {
      const filteredRecord: Record<string, string> = {};

      const { data: primaryContact } =
        typeof record.contact_primary === "number"
          ? await dataProvider.getOne("contacts", { id: record.contact_primary })
          : { data: {} };

      for (const [header, field] of Object.entries(headers)) {
        if (header === "Primary Associate Job Title") {
          filteredRecord[header as keyof typeof headers] =
            primaryContact?.title || "";
          continue;
        }
        if (header === "Primary Name") {
          filteredRecord[header as keyof typeof headers] =
            (primaryContact?.first || "") + " " + (primaryContact?.last || "");
          continue;
        }

        let value = field
          .split(".")
          .reduce((o: unknown, key: string) => (o as any)?.[key], record);
        value =
          typeof value === "boolean" ? (value ? "Yes" : "No") : value || "";
        filteredRecord[header as keyof typeof headers] = value as string;
      }

      return filteredRecord;
    })
  );

  const sortedData = data.sort((a, b) => {
    const nameA = a["Company Name"]?.toLowerCase() || "";
    const nameB = b["Company Name"]?.toLowerCase() || "";

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  return jsonExport(sortedData, (err: Error, csv: string) => {
    if (err) {
      console.error("Error exporting CSV:", err);
      return;
    }
    downloadCSV(csv, `${title}.csv`);
  });
};