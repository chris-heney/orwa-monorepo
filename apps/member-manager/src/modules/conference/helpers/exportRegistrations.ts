import { ConfigurableDatagridColumn, DataProvider, RaRecord } from 'react-admin'
import { formatNumber } from '../../../helpers/Formators'
import { fetchRelatedRecord, readExportColumn, relationDisplayValue, selectExportColumns } from '../../../helpers/fetchRelatedRecord'
import downloadJsonAsCsv from '../../../helpers/downloadJsonAsCsv'
// import { balance } from '../../payouts/components/BalanceField'
// import { totalPaidOut } from '../../payouts/components/TotalPayoutField'

const exportRegistrations = async (RecordList: RaRecord[], availableColumns: ConfigurableDatagridColumn[], columnIds: string[], title: string, dataProvider: DataProvider) => {
  // When you use async functions within map, it returns an array of promises, 
  // not the actual data you're expecting. That's why adding await inside the map function 
  // will cause the export to be blank because jsonExport is called before all the promises are resolved.
  const data = await Promise.all(RecordList.map(async (registration) => {

    const filteredRecord = {} as Record<string, string>

    // Export every column the user has on screen, in their order. This used to
    // `.slice(8, 11)` the filtered list — a positional pick that silently threw
    // away all but three columns and could not survive column reordering.
    const columns = selectExportColumns(availableColumns, columnIds)

    const registrant = await fetchRelatedRecord(
      dataProvider,
      'contacts',
      registration.registrant
    )


    for (const column of columns) {

      if (column.label && column.label.trim() !== '') {
        let value: unknown = readExportColumn(registration, column)

        if (column.label === 'Registrant') {
          value = `${registrant.first ?? ''} ${registrant.last ?? ''}`.trim()
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
          value = relationDisplayValue(readExportColumn(registration, column))
        }

        // Assign the value to the corresponding label in the filtered record
        filteredRecord[column.label as keyof typeof registration] = value as string
      }
    }

    return filteredRecord
  }))

  return downloadJsonAsCsv(data, `${title}`)
}

export default exportRegistrations
