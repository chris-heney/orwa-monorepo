import jsonExport from "jsonexport/dist";
import { downloadCSV } from "react-admin";

/**
 * Convert rows to CSV and download it — as a promise that actually settles.
 *
 * jsonexport 3.x always returns a Promise, but when it is handed a callback it
 * calls the callback and never resolves that Promise. Every exporter here did
 * `return jsonExport(rows, cb)` from an async function, so the file downloaded
 * while the exporter's own promise stayed pending forever: the Conference
 * Export button never left its loading state and the "Export ready" toast
 * never fired. It also ignored `err`, handing `undefined` to `downloadCSV`.
 *
 * Resolves `void` so exporters keep react-admin's `Exporter` signature.
 */
export const downloadJsonAsCsv = (
  rows: object[],
  filename: string,
  options: Record<string, unknown> = {}
): Promise<void> =>
  new Promise((resolve, reject) => {
    const done = (err: Error | null, csv: string) => {
      if (err) {
        reject(err);
        return;
      }
      downloadCSV(csv, filename);
      resolve();
    };
    // Keep the exact `(rows, callback)` call every exporter made before when
    // there are no options — jsonexport picks its overload by argument count.
    if (Object.keys(options).length > 0) {
      jsonExport(rows, options, done);
    } else {
      jsonExport(rows, done);
    }
  });

export default downloadJsonAsCsv;
