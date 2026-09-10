import React from "react";
import { useRecordContext } from "react-admin";
import ScholarshipPrintButton from "./ScholarshipPrintButton";
import type { ScholarshipPacketRecord } from "../helpers/printScholarshipPacket";

const BAR_SX = { color: "white", minWidth: 0 };

/** Bar action (Applications tab): print the selected packets. */
export const PrintSelectedScholarshipsAction = () => (
  <ScholarshipPrintButton listMode sx={BAR_SX} />
);

/** Bar action (show page): print this application's packet. */
export const PrintScholarshipRecordAction = () => {
  const record = useRecordContext<ScholarshipPacketRecord>();
  return <ScholarshipPrintButton record={record} sx={BAR_SX} />;
};
