import jsonExport from 'jsonexport/dist';
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  RaRecord,
  DataProvider,
} from 'react-admin';
import {
  exportRelationResource,
  resolveExportCell,
} from '../../../helpers/fetchRelatedRecord';

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
    let columns = availableColumns;

    if (columnIds.length > 0) {
      columns = availableColumns.filter((column) =>
        columnIds.includes(column.index)
      );
    }

    for (const column of columns) {
      if (column.label && column.label.trim() !== '') {
        filteredRecord[column.label] = await resolveExportCell(
          record[column.source as keyof typeof record],
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
  return jsonExport(data, (err: Error, csv: string) => {
    if (err) {
      console.error('CSV Export Error:', err);
      return;
    }
    downloadCSV(csv, `${title}.csv`);
  });
};

export default CustomContactExport;