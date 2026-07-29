export default interface IAttendee {
    id: number
    first: string
    last: string
    email: string
    phone: string
    organization: string
    type: string
    conference_ticket: {
        name: string
    } | null
}

