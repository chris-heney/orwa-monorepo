import jsonExport from 'jsonexport/dist'
import { downloadCSV, ConfigurableDatagridColumn, DataProvider, RaRecord } from 'react-admin'
import { balance } from '../../payouts/components/BalanceField'
import { totalPaidOut } from '../../payouts/components/TotalPayoutField'

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

    for (const column of columns) {

      if (column.label && column.label.trim() !== '') {
        let value
       
        if (column.label === 'Application') {
          value = await dataProvider.getOne('grant-application-finals', { id: payout.application }).then(({ data }) => {return (data.legal_entity_name)})
        }
        else if (column.label === 'Awarded') { 
          value = await dataProvider.getOne('grant-application-finals', { id: payout.application }).then(({ data }) => {return (data.award_amount)})
        } 
        else if (column.label === 'Status') { 
          value = await dataProvider.getOne('payout-statuses', { id: payout.payout_status }).then(({ data }) => {return (data.name)})
        }
        else if (column.label === 'Balance') {
          value = await balance(dataProvider, payout.application)
        } else if (column.label === 'Total Paid Out') {
          value = await totalPaidOut(dataProvider, payout.application)
        } else {
          value = payout[column.source as keyof typeof payout]
          value = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
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
