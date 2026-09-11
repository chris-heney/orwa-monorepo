import {
  ConfigurableDatagridColumn,
  RaRecord,
  DataProvider,
} from 'react-admin';
import {
  exportRelationResource,
  readExportColumn,
  resolveExportCell,
  selectExportColumns,
} from '../../../helpers/fetchRelatedRecord';
import downloadJsonAsCsv from "../../../helpers/downloadJsonAsCsv"

const fetchAllRecords = async (dataProvider: any, resource: string, page = 1, perPage = 1000, accumulatedRecords: RaRecord[] = []) => {
  const { data, total } = await dataProvider.getList(resource, {
    pagination: { page, perPage },
    sort: { field: 'id', order: 'ASC' },
    filter: {},
  });

  const newRecords = accumulatedRecords.concat(data);

  if (newRecords.length >= total) {
    return newRecords;
  }

  // Recursively fetch the next page
  return fetchAllRecords(dataProvider, resource, page + 1, perPage, newRecords);
};

const CustomContactExport = async (
  resource: string,
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  dataProvider: DataProvider,
  title: string
) => {
  // Fetch all records recursively
  console.log('Fetching all records for export...');
  const RecordList = await fetchAllRecords(dataProvider, resource);

  const data = await Promise.all(
    RecordList.map(async (record) => {
    const filteredRecord = {} as Record<string, string>;
    const columns = selectExportColumns(availableColumns, columnIds);

    for (const column of columns) {
      if (column.label && column.label.trim() !== '') {
        filteredRecord[column.label] = await resolveExportCell(
          readExportColumn(record, column),
          {
            dataProvider,
            resource: exportRelationResource(column.source, column.label),
          }
        );

        if (column.label === 'Team') {
          filteredRecord['Team'] = await resolveExportCell(record.team, {
            dataProvider,
            resource: 'conference-teams',
          });
        }
      }
    }

    return filteredRecord;
  })
  );

  // Export the combined records to CSV
  return downloadJsonAsCsv(data, `${title}.csv`).catch((err: Error) => {
    console.error('CSV Export Error:', err);
  });
};

export default CustomContactExport;