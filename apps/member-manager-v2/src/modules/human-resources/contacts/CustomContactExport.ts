import jsonExport from 'jsonexport/dist';
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  RaRecord,
  DataProvider,
} from 'react-admin';

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

  const data = RecordList.map((record) => {
    const filteredRecord = {} as Record<string, string>;
    let columns = availableColumns;

    if (columnIds.length > 0) {
      columns = availableColumns.filter((column) =>
        columnIds.includes(column.index)
      );
    }

    for (const column of columns) {
      if (column.label && column.label.trim() !== '') {
        const value = record[column.source as keyof typeof record]
          ? Array.isArray(record[column.source as keyof typeof record])
            ? record[column.source as keyof typeof record]
                .map((item: ConfigurableDatagridColumn) => `${item.label}`)
                .join(', ')
            : typeof record[column.source as keyof typeof record] === 'boolean'
            ? record[column.source as keyof typeof record]
              ? 'Yes'
              : 'No'
            : record[column.source as keyof typeof record]
          : '';

        filteredRecord[column.label] = value as string;

        if (column.label === 'Team' && record.team) {
          filteredRecord['Team'] = record.team.name;
        }
      }
    }

    return filteredRecord;
  });

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