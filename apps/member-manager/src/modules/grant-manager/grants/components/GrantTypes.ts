import { Identifier } from 'react-admin'
import { IGrantApplication } from '../../grant-application/GrantApplicationTypes'

export interface IGrant {
    id: Identifier
    /** Numeric Strapi PK; used for relation filters (id is documentId). */
    entityId?: number
    name: string
    status: string
    reimbursement_type: string
    opens: Date
    closes : Date
    type: IGrantType
    grant_amount: string
    funds_approved: number
    funds_provided: number
    admin_amount: string
}

export interface IGrantType {
    id: number
    name: string
    description: string
}

export interface IGrantPayout {
    id: Identifier
    amount: number
    transaction_date: Date
    grant: IGrant
    application: IGrantApplication
    type: "Administrative" | "Reimbursement"
}