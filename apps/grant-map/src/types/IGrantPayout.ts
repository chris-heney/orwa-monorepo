import IGrant from "./IGrant"
import IGrantApplication from "./IGrantApplication"
import IGrantApplicationStatus from "./IGrantApplicationStatus"

export default interface IGrantPayout {
  id: number
  documentId?: string
  amount: number
  transaction_date: Date
  currentApplication?: IGrantApplication | number
  grant?: IGrant | number
  status: string
  supporting_documents?: unknown
  date_approved?: Date | null
  comments: string | null
  grant_status?: IGrantApplicationStatus
}
