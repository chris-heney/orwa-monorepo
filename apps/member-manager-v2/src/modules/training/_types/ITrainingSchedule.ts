import ITrainingBlock from './ITrainingBlock'
import ITrainingEvent from './ITrainingEvent'

export default interface ITrainingSchedule {
  id: number
  event: ITrainingEvent
  training_schedule_blocks: ITrainingBlock[]
}