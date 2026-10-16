import React from "react";
import type { DataProvider, Identifier } from "react-admin";
import {
  PrintPacketRowButton,
  type PrintPacketAdapter,
} from "../../../framework/PrintPacketAction";
import {
  AWARD_PRINT_POPULATE,
  nominationPacketYear,
  type AwardNominationPrintRecord,
} from "../helpers/nominationPrintModel";
import { generateNominationApplicationPdf } from "../helpers/printNominationApplication";

/** RaStore key the grid writes its ticks to (same key RA's ListBase reads). */
export const AWARD_SELECTED_IDS_KEY = "award-nominations.selectedIds";

const fetchNomination = async (
  dataProvider: DataProvider,
  id: Identifier
): Promise<AwardNominationPrintRecord> => {
  const { data } = await dataProvider.getOne("award-nominations", {
    id,
    meta: { populate: AWARD_PRINT_POPULATE, raw: true },
  });
  return data as AwardNominationPrintRecord;
};

/**
 * Awards' half of the shared Print packet preset (`framework/PrintPacketAction`):
 * fresh populated fetch, the nomination generator, and the packet year label.
 */
export const awardPrintAdapter: PrintPacketAdapter<AwardNominationPrintRecord> = {
  noun: "award nomination",
  mergedFilenamePrefix: "ORWA-Award-Nominations",
  fetchRecords: async (ids, dataProvider) => {
    const records: AwardNominationPrintRecord[] = [];
    for (const id of ids) records.push(await fetchNomination(dataProvider, id));
    return records;
  },
  buildPacket: async (record, options) => {
    const { bytes, filename, attachments } = await generateNominationApplicationPdf(
      record,
      options
    );
    return { bytes, filename, attachments };
  },
  // Single conference year ("2027") — Awards never use the split label.
  packetYearLabel: (record) => String(nominationPacketYear(record)),
};

/** Row action in the Nominations grid — same dialog as the bar's Print. */
export const AwardRowPrintButton = ({
  record,
}: {
  record: AwardNominationPrintRecord | Record<string, unknown>;
}) => (
  <PrintPacketRowButton
    record={record as Record<string, unknown>}
    adapter={awardPrintAdapter}
    label="Print nomination packet"
  />
);
