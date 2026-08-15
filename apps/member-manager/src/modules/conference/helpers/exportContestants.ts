import jsonExport from 'jsonexport/dist'
import { downloadCSV, ConfigurableDatagridColumn, RaRecord, DataProvider } from 'react-admin'
import { fetchRelatedRecord, relationDisplayValue } from '../../../helpers/fetchRelatedRecord'

const exportContestants = async (RecordList: RaRecord[], availableColumns: ConfigurableDatagridColumn[], columnIds: string[], title: string, dataProvider: DataProvider) => {

  const data = await Promise.all(RecordList.map(async (record) => {

    const filteredRecord = {} as Record<string, string>

    let columns = availableColumns

    if (columnIds.length > 0) {
      columns = availableColumns.filter(column => columnIds?.includes(column.index))
    }

    const team = await fetchRelatedRecord(dataProvider, 'conference-teams', record.team)

    for (const column of columns) {

      // Check if the column has a label and it's not empty
      if (column.label && column.label.trim() !== '') {

        let value = relationDisplayValue(
          typeof column.source !== 'undefined'
            ? record[column.source as keyof typeof record]
            : record[column.label.toLowerCase() as keyof typeof record]
        )

        if (column.label === 'Team' && team.name) {       
          value = team.name
        }
        filteredRecord[column.label as keyof typeof record] = value as string
      }
    }
    return filteredRecord
  }))

  return jsonExport(data, (err: Error, csv: string) => downloadCSV(csv, `${title}`))
}


export default exportContestants