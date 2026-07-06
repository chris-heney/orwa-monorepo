import { Identifier } from 'react-admin'

export default interface IContact {
  avatar: IAvatar[]
  id: Identifier
  first: string
  last: string
  email: string
  phone: string
  title: string
  contact_type: string
  user: IUser
  address_mailing_line1?: string
  address_mailing_line2?: string
  address_mailing_city?: string
  address_mailing_state?: string
  address_mailing_zip?: string
}


interface IAvatar {
  url: string
}

interface IUser {
  id: Identifier
  username: string
  email: string
  password: string
  confirmed: boolean
  blocked: boolean
  role: string
  wp_uid: number
  user_preferences: string
}