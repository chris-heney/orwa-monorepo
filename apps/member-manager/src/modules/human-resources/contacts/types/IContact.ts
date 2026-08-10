import { IUser } from '../../users/types'
import IContactType from './IContactType'

export default interface IContact {
  id: number
  first: string
  last: string
  email: string
  phone: string
  title: string
  contact_type: IContactType
  license: string
  user: number | IUser
  avatar: IAvatar[]
  address_mailing_line1?: string
  address_mailing_line2?: string
  address_mailing_city?: string
  address_mailing_state?: string
  address_mailing_zip?: string
  directory_opt_out?: boolean
}



interface IAvatar {
  url: string
}