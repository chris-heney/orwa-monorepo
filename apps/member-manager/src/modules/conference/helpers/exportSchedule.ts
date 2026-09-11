import { ConfigurableDatagridColumn, RaRecord, DataProvider } from 'react-admin'
import formatTime from '../../_helpers/formatTime'
import {
  exportRelationResource,
  readExportColumn,
  resolveExportCell,
  selectExportColumns,
} from '../../../helpers/fetchRelatedRecord'
import downloadJsonAsCsv from '../../../helpers/downloadJsonAsCsv'

const exportSchedule = async (RecordList: RaRecord[], availableColumns: ConfigurableDatagridColumn[], columnIds: string[], title: string, dataProvider: DataProvider) => {

  const data = await Promise.all(RecordList.map(async (schedule) => {

    const filteredRecord = {} as Record<string, string>

    const columns = selectExportColumns(availableColumns, columnIds);

    for (const column of columns) {

      // Check if the column has a label and it's not empty
      if (column.label && column.label.trim() !== '') {

        let value = await resolveExportCell(
          readExportColumn(schedule, column),
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

  return downloadJsonAsCsv(data, `${title}`)
}


export default exportSchedule