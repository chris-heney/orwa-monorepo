import jsonExport from 'jsonexport/dist'
import { downloadCSV, ConfigurableDatagridColumn, DataProvider, Identifier, RaRecord } from 'react-admin'
import { balance } from '../../payouts/components/BalanceField'
import { totalPaidOut } from '../../payouts/components/TotalPayoutField'
import {
  fetchRelatedRecord,
  relationDisplayValue,
} from '../../../../helpers/fetchRelatedRecord'

const exportPayouts = async (RecordList: RaRecord[], availableColumns: ConfigurableDatagridColumn[], columnIds: string[], title: string, dataProvider: DataProvider) => {
  // When you use async functions within map, it returns an array of promises, 
  // not the actual data you're expecting. That's why adding await inside the map function 
  // will cause the export to be blank because jsonExport is called before all the promises are resolved.
  const data = await Promise.all(RecordList.map(async (payout) => {

    const filteredRecord = {} as Record<string, string>

    let columns = availableColumns

    if (columnIds.length > 0) {
      columns = availableColumns.filter(column => columnIds?.includes(column.index))
    }

    const application = await fetchRelatedRecord(
      dataProvider,
      'grant-application-finals',
      payout.application
    )
    const payoutStatus = await fetchRelatedRecord(
      dataProvider,
      'payout-statuses',
      payout.payout_status
    )
    const applicationId = (application.id ?? payout.application) as Identifier

    for (const column of columns) {

      if (column.label && column.label.trim() !== '') {
        let value
       
        if (column.label === 'Application') {
          value = application.legal_entity_name ?? ''
        }
        else if (column.label === 'Awarded') { 
          value = application.award_amount ?? ''
        } 
        else if (column.label === 'Status') { 
          value = payoutStatus.name ?? ''
        }
        else if (column.label === 'Balance') {
          value = applicationId != null ? await balance(dataProvider, applicationId) : ''
        } else if (column.label === 'Total Paid Out') {
          value = applicationId != null ? await totalPaidOut(dataProvider, applicationId) : ''
        } else {
          value = relationDisplayValue(payout[column.source as keyof typeof payout])
        }

        // Assign the value to the corresponding label in the filtered record
        filteredRecord[column.label as keyof typeof payout] = value as string
      }
    }

    return filteredRecord
  }))

  return jsonExport(data, (err: Error, csv: string) => downloadCSV(csv, `${title}`))
}

export default exportPayouts
