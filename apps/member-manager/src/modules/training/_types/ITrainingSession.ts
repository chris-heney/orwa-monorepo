import { Identifier } from 'react-admin'
import ITrainingTopic from './ITrainingTopic'
import ITrainingInstructor from './ITrainingInstructor'
import { Dayjs } from 'dayjs'


export default interface ITrainingSession {
  id: Identifier | null
  topic: ITrainingTopic | null 
  training_instructor: ITrainingInstructor | null
  category: string
  summary: string
  start: Date | null | Dayjs | string
  end: Date | null | Dayjs  | string
}


