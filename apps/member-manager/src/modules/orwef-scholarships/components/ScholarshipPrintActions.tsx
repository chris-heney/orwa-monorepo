import React from "react";
import type { DataProvider, Identifier } from "react-admin";
import {
  PrintPacketRowButton,
  type PrintPacketAdapter,
} from "../../../framework/PrintPacketAction";
import {
  generateScholarshipPacketPdf,
  type ScholarshipPacketRecord,
} from "../helpers/printScholarshipPacket";
import { scholarshipPacketYear } from "../helpers/scholarshipPacketFilename";
import { formatScholarshipYear } from "../../../helpers/conferenceCycleYear";

/** RaStore key the grid writes its ticks to (same key RA's ListBase reads). */
export const SCHOLARSHIP_SELECTED_IDS_KEY =
  "scholarship-applications.selectedIds";

const fetchApplication = async (
  dataProvider: DataProvider,
  id: Identifier
): Promise<ScholarshipPacketRecord> => {
  const { data } = await dataProvider.getOne("scholarship-applications", {
    id,
    meta: { populate: "*", raw: true },
  });
  return data as ScholarshipPacketRecord;
};

/**
 * ORWEF's half of the shared Print packet preset (`framework/PrintPacketAction`):
 * fresh populated fetch, the scholarship generator, and the packet year label
 * (the split academic year, "2027-2028" — same as the single filename).
 */
export const scholarshipPrintAdapter: PrintPacketAdapter<ScholarshipPacketRecord> = {
  noun: "scholarship application",
  mergedFilenamePrefix: "ORWEF-Scholarships",
  fetchRecords: async (ids, dataProvider) => {
    const records: ScholarshipPacketRecord[] = [];
    for (const id of ids) records.push(await fetchApplication(dataProvider, id));
    return records;
  },
  buildPacket: async (record, options) => {
    const { bytes, filename, attachments } = await generateScholarshipPacketPdf(
      record,
      options
    );
    return { bytes, filename, attachments };
  },
  packetYearLabel: (record) =>
    formatScholarshipYear(scholarshipPacketYear(record)),
};

/** Row action in the Applications grid — same dialog as the bar's Print. */
export const ScholarshipRowPrintButton = ({
  record,
}: {
  record: Record<string, unknown>;
}) => (
  <PrintPacketRowButton
    record={record}
    adapter={scholarshipPrintAdapter}
    label="Print application packet"
  />
);
