export interface IContestant {
    conference: number
    year: number
    type: string
    organization: string
    team: {
        id: number
        name: string
    } | null
    watersystem?: {
        name: string
    } | null
    first: string
    last: string
    email: string
    phone: string
    conference_ticket: number
    items: any[]
}
