import jsonExport from 'jsonexport/dist'
import { downloadCSV, ConfigurableDatagridColumn, DataProvider, RaRecord } from 'react-admin'
import { formatNumber } from '../../../helpers/Formators'
// import { balance } from '../../payouts/components/BalanceField'
// import { totalPaidOut } from '../../payouts/components/TotalPayoutField'

const exportRegistrations = async (RecordList: RaRecord[], availableColumns: ConfigurableDatagridColumn[], columnIds: string[], title: string, dataProvider: DataProvider) => {
  // When you use async functions within map, it returns an array of promises, 
  // not the actual data you're expecting. That's why adding await inside the map function 
  // will cause the export to be blank because jsonExport is called before all the promises are resolved.
  const data = await Promise.all(RecordList.map(async (registration) => {

    const filteredRecord = {} as Record<string, string>

    let columns = availableColumns

    if (columnIds.length > 0) {
      columns = availableColumns.filter(column => columnIds?.includes(column.index)).slice(8,11)
    }

    const { data: registrant } = registration.registrant ? await dataProvider.getOne('contacts', { id: registration.registrant }) : { data: {} }


    for (const column of columns) {

      if (column.label && column.label.trim() !== '') {
        let value = registration[column.source as keyof typeof registration]

        if (column.label === 'Registrant') {
          value = registrant.first + ' ' + registrant.last
        }
        else if (column.label === 'Email') {
          value = registrant.email
        }
        else if (column.label === 'Phone') {
          value = registrant.phone
        }
        else if (column.label === 'Total') {
          value = formatNumber(registration.total)
        }
        else if (column.label === 'Street') {
          value = registration.address ? `${registration.address.street}` : ''
        }
        else if (column.label === 'City') {
          value = registration.address ? `${registration.address.city}` : ''
        }
        else if (column.label === 'State') {
          value = registration.address ? `${registration.address.state}` : ''
        }
        else if (column.label === 'Zip') {
          value = registration.address ? `${registration.address.zip}` : ''
        }
        else if (Array.isArray(registration[column.label.toLowerCase() as keyof typeof registration])) {
          value = registration[column.label.toLowerCase() as keyof typeof registration]
            .map((item: ConfigurableDatagridColumn) => `${item.label}`)
            .join(', ')
        }
        else {
          value = registration[column.source as keyof typeof registration]
          value = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
        }

        // Assign the value to the corresponding label in the filtered record
        filteredRecord[column.label as keyof typeof registration] = value as string
      }
    }

    return filteredRecord
  }))

  return jsonExport(data, (err: Error, csv: string) => {
    return downloadCSV(csv, `${title}`)
  })
}

export default exportRegistrations
