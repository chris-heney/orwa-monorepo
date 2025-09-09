import IGrantType from "./IGrantType"

export default interface IGrant {
  id: number
  name: string
  status: 'open' | 'closed' | 'suggested'
  reimbursement_type: 'Lump Sum' | 'Reimbursement'
  opens: Date
  closes: Date
  type: number | IGrantType
  grant_amount: number
  funds_approved: number
  funds_provided: number
  max_award: number
  eligibility: string 
}