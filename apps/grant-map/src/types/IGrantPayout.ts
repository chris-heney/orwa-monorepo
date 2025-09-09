import IGrant from "./IGrant"
import IGrantApplication from "./IGrantApplication"
import IGrantApplicationStatus from "./IGrantApplicationStatus"

export default interface IGrantPayout {
  id: string
  data : {
    amount: number
    transaction_date: Date
    currentApplication: IGrantApplication | number
    grant: IGrant | number
    status: IGrantApplication
    supporting_documents?: unknown
    date_approvied: Date
    comments: string
    grant_status: IGrantApplicationStatus
  }[]
}