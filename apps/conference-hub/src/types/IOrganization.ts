import IAttendee from "./IAttendee"

export default interface IOrganization {
  name: string
  attendees: IAttendee[]
}