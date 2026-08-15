import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
import {
  exportRelationResource,
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
          const raw =
            record[column.source as keyof typeof record] ??
            record[column.label.toLowerCase() as keyof typeof record];
          const resource = exportRelationResource(
            column.source,
            column.label,
            relationResources
          );
          filteredRecord[column.label as keyof typeof record] =
            await resolveExportCell(raw, { dataProvider, resource });
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
