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
}



interface IAvatar {
  url: string
}