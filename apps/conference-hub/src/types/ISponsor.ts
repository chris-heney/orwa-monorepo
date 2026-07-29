export interface ISponsor {
    conference: number //relationship to conference
    year: number
    amount: number
    organization: string
    registration: {
        phone: string
        email: string
        organization: string
    } | null
    sponsorships: {
        id: number
        amount: number
        name: string
    }[] | null
    phone: string
    email: string
    logo: {
        url: string
    } | null
}
