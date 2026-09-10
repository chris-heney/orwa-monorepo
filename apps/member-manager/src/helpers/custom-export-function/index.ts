import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
import {
  exportRelationResource,
  isIdSource,
  readExportCellValue,
  resolveExportCell,
} from "../fetchRelatedRecord";

const CustomExportFunction = async (
  RecordList: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider?: DataProvider,
  relationResources?: Record<string, string>
) => {
  const data = await Promise.all(
    RecordList.map(async (record) => {
      const filteredRecord = {} as Record<string, string>;

      let columns = availableColumns;

      if (columnIds.length > 0) {
        columns = availableColumns.filter((column) =>
          columnIds?.includes(column.index)
        );
      }

      for (const column of columns) {
        if (column.label && column.label.trim() !== "") {
          const raw = readExportCellValue(record, column.source, column.label);
          // ID columns export the numeric PK (what EntityIdField shows on
          // screen) — never the documentId, and never a relation lookup.
          if (isIdSource(column.source)) {
            filteredRecord[column.label as keyof typeof record] =
              raw == null ? "" : String(raw);
          } else {
            const resource = exportRelationResource(
              column.source,
              column.label,
              relationResources
            );
            filteredRecord[column.label as keyof typeof record] =
              await resolveExportCell(raw, { dataProvider, resource });
          }
        }

        if (column.label === "Team") {
          filteredRecord["Team"] = await resolveExportCell(record.team, {
            dataProvider,
            resource:
              relationResources?.team ??
              exportRelationResource("team", "Team", relationResources),
          });
        }
      }
      return filteredRecord;
    })
  );

  return jsonExport(data, (err: Error, csv: string) =>
    downloadCSV(csv, `${title}`)
  );
};

export default CustomExportFunction;
