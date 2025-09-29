import { ITrainingSession } from '../training-events-old/components/EventTypes'


export default interface ITrainingBlock {
  id?: number
  date: string
  am_pm: string
  training_sessions?: number[]
  sessions: ITrainingSession[]
}