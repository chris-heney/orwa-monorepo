import { Identifier } from 'react-admin'

export default interface ITrainingTopic {
  id: Identifier | number 
  name: string
  category: string
  description: string
  hours: number
}