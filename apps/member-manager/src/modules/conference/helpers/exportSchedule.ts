import jsonExport from 'jsonexport/dist'
import { downloadCSV, ConfigurableDatagridColumn, RaRecord, DataProvider } from 'react-admin'
import formatTime from '../../_helpers/formatTime'
import {
  exportRelationResource,
  resolveExportCell,
} from '../../../helpers/fetchRelatedRecord'

const exportSchedule = async (RecordList: RaRecord[], availableColumns: ConfigurableDatagridColumn[], columnIds: string[], title: string, dataProvider: DataProvider) => {

  const data = await Promise.all(RecordList.map(async (schedule) => {

    const filteredRecord = {} as Record<string, string>

    let columns = availableColumns

    if (columnIds.length > 0) {
      columns = availableColumns.filter(column => columnIds?.includes(column.index))
    }

    for (const column of columns) {

      // Check if the column has a label and it's not empty
      if (column.label && column.label.trim() !== '') {

        let value = await resolveExportCell(
          typeof column.source !== 'undefined'
            ? schedule[column.source as keyof typeof schedule]
            : schedule[column.label.toLowerCase() as keyof typeof schedule],
          {
            dataProvider,
            resource: exportRelationResource(column.source, column.label),
          }
        )

        if (column.label === 'Start Time' && schedule.start) {
            value = formatTime(schedule.start)
        }
        if (column.label === 'End Time' && schedule.end) {
            value = formatTime(schedule.end)
        }
        if (column.label === 'Date' && schedule.date) {
            const d = new Date(schedule.date)
            d.setDate(d.getDate() + 1)
            value = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
        filteredRecord[column.label as keyof typeof schedule] = value as string
      }
    }
    return filteredRecord
  }))

  return jsonExport(data, (err: Error, csv: string) => downloadCSV(csv, `${title}`))
}


export default exportSchedule