export interface IContestant {
    conference: number | { id?: number; name?: string } | null
    year: number
    type: string | null
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
    /** Numeric id when unpopulated; object when `populate=*` (Strapi v5). */
    conference_ticket:
        | number
        | {
              id?: number
              documentId?: string
              name?: string
              context?: string
          }
        | null
    items: any[] | null
}
