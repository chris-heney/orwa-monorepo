import {
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
import {
  buildExportRelationCache,
  exportRelationResource,
  isIdSource,
  readExportCellValue,
  resolveExportCell,
  selectExportColumns,
} from "../fetchRelatedRecord";
import downloadJsonAsCsv from "../downloadJsonAsCsv";

const CustomExportFunction = async (
  RecordList: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider?: DataProvider,
  relationResources?: Record<string, string>
) => {
  // Columns come out in the order the user arranged them on screen, not in
  // declaration order (see `selectExportColumns`).
  const columns = selectExportColumns(availableColumns, columnIds);

  // One `getMany` per relation type up front, instead of a `getOne` per record
  // per relation column while building the rows.
  const cache = await buildExportRelationCache(
    RecordList,
    columns,
    dataProvider,
    relationResources
  );

  const data = await Promise.all(
    RecordList.map(async (record) => {
      const filteredRecord = {} as Record<string, string>;

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
              await resolveExportCell(raw, { dataProvider, resource, cache });
          }
        }

        if (column.label === "Team") {
          filteredRecord["Team"] = await resolveExportCell(record.team, {
            dataProvider,
            resource:
              relationResources?.team ??
              exportRelationResource("team", "Team", relationResources),
            cache,
          });
        }
      }
      return filteredRecord;
    })
  );

  return downloadJsonAsCsv(data, `${title}`);
};

export default CustomExportFunction;
