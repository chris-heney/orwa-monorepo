import { ConfigurableDatagridColumn, RaRecord, DataProvider } from 'react-admin'
import CustomExportFunction from '../../../helpers/custom-export-function'

/**
 * Contestants → CSV.
 *
 * The shared exporter resolves Team and Ticket to their names with one batched
 * lookup per relation (this used to fetch the team once per row and wrote the
 * ticket's documentId), and joins the Items chips' labels.
 */
const exportContestants = (
  RecordList: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider: DataProvider
) => CustomExportFunction(RecordList, availableColumns, columnIds, title, dataProvider)

export default exportContestants
