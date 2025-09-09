export default interface IAddress {
  address_line1: string
  address_line2: string
  city: string
  state: string
  zip: string
  lat?: number
  lng?: number
}